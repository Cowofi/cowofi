<template>
  <q-page padding>
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-sm-4 chats-container q-mt-md">
            <div v-if="loadingChats" class="text-center">
              <q-spinner color="primary" size="3em" />
            </div>
            <div
              v-else-if="!loadingChats && chats.length === 0"
              class="text-center text-grey-7"
            >
              <q-icon size="lg" name="eva-people-outline" />
              <p class="text-h6 q-mt-md">
                {{ $t("common.conversations") }}
              </p>
            </div>
            <div class="row q-col-gutter-md" v-if="chats.length > 0">
              <div class="col-12" v-for="chat in chats" :key="chat.id">
                <chat-card
                  :chat="chat"
                  :is-selected="selectedChat && selectedChat.id === chat.id"
                  @selected="onSelectChat(chat)"
                />
                <q-separator class="q-my-md" />
              </div>
            </div>
          </div>
          <div class="col-sm-8 q-mt-md">
            <div
              class="row q-col-gutter-md"
              v-if="!loadingMessages && selectedChat"
            >
              <div class="col-12">
                {{ selectedChat.to_user_name }}
                <q-separator class="q-mt-md" />
              </div>
              <div class="col-12 messages-container">
                <q-chat-message
                  v-for="message in messages"
                  :key="message.id"
                  :text="[message.message]"
                  :sent="user.id === message.user_id"
                />
              </div>
              <div class="col-12">
                <q-input
                  @keyup.enter="sendMessage"
                  :placeholder="`${$t('common.sendMessage')}...`"
                  v-model="message"
                  outlined
                >
                  <template v-slot:append v-if="message">
                    <q-btn
                      @click="sendMessage"
                      flat
                      color="primary"
                      :label="$t('common.sendMessage')"
                    />
                  </template>
                </q-input>
              </div>
            </div>

            <div v-if="loadingMessages" class="text-center">
              <q-spinner color="primary" size="3em" />
            </div>
            <div
              class="text-center text-grey-7"
              v-else-if="
                !loadingMessages && messages.length === 0 && !selectedChat
              "
            >
              <q-icon size="lg" name="eva-message-circle-outline" />
              <p class="text-h6 q-mt-md">{{ $t("common.yourMessages") }}</p>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
import supabase from "src/boot/supabase";
import { useAuthStore } from "src/stores/Auth";
import { Notify } from "quasar";
import { useRoute } from "vue-router";
import ChatCard from "components/Messages/ChatCard.vue";
import { v4 } from "uuid";

export default {
  name: "PageMessages",
  components: {
    ChatCard,
  },
  setup() {
    const { user } = useAuthStore();
    const { params } = useRoute();
    const chats = ref([]);
    const selectedChat = ref(null);
    const messages = ref([]);
    const loadingChats = ref(true);
    const loadingMessages = ref(false);
    const message = ref("");
    const chatSubscription = ref(null);

    const focusLastChatMessage = () => {
      let pageChat = document.querySelector(".messages-container");
      if (pageChat) {
        setTimeout(() => {
          pageChat.scrollTop = pageChat.scrollHeight;
        }, 20);
      }
    };

    supabase
      .from("chats")
      .select()
      .or(`from_user.eq.${user.id},to_user.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          Notify.create({
            color: "negative",
            textColor: "white",
            message: error.message,
          });
        }

        if (data) {
          chats.value = data;
        }
        loadingChats.value = false;
      });

    const createChat = ({ toUserId, fullName }) => {
      loadingChats.value = true;
      supabase
        .from("chats")
        .insert({
          from_user: user.id,
          from_user_name: user.user_metadata.full_name,
          to_user: toUserId,
          to_user_name: fullName,
        })
        .then(({ data, error }) => {
          if (error) {
            Notify.create({
              color: "negative",
              textColor: "white",
              message: error.message,
            });
          }

          if (data) {
            chats.value.push(data[0]);
            selectedChat.value = data[0];
          }
          loadingChats.value = false;
        });
    };

    const fetchChat = (userId) => {
      loadingChats.value = true;
      supabase
        .from("chats")
        .select()
        .eq("to_user", userId)
        .then(async ({ data, error }) => {
          if (error) {
            Notify.create({
              color: "negative",
              textColor: "white",
              message: error.message,
            });
          }

          if (data) {
            const chat = data[0];

            if (!chat) {
              const { data, error } = await supabase
                .from("users")
                .select()
                .eq("id", userId);
              const toUser = data[0];
              createChat({
                toUserId: userId,
                fullName: toUser.raw_user_meta_data.full_name,
              });
            } else {
              selectedChat.value = chat;
              fetchMessages(chat);
            }
          }
          loadingChats.value = false;
        });
    };

    const fetchMessages = (chat) => {
      loadingMessages.value = true;
      supabase
        .from("messages")
        .select()
        .eq("chat_id", chat.id)
        .order("created_at", { ascending: true })
        .then(({ data, error }) => {
          if (error) {
            Notify.create({
              color: "negative",
              textColor: "white",
              message: error.message,
            });
          }

          if (data) {
            selectedChat.value = chat;
            messages.value = data;
            focusLastChatMessage();
          }
          loadingMessages.value = false;
        });
    };

    const susbscribeToChatMessages = (chatId) => {
      chatSubscription.value = supabase
        .from(`messages:chat_id=eq.${chatId}`)
        .on("INSERT", (payload) => {
          messages.value.push(payload.new);
          focusLastChatMessage();
        })
        .subscribe();
    };

    const onSelectChat = (chat) => {
      fetchMessages(chat);
      susbscribeToChatMessages(chat.id);
    };

    if (params.userId) {
      fetchChat(params.userId);

      if (chatSubscription.value) {
        supabase.removeSubscription(spacesSubscription).then(() => {
          susbscribeToChatMessages(params.userId);
        });
      } else {
        susbscribeToChatMessages(params.userId);
      }
    }

    return {
      chats,
      selectedChat,
      loadingChats,
      loadingMessages,
      message,
      messages,
      chatSubscription,
      user,
      fetchMessages,
      onSelectChat,
      sendMessage() {
        if (message.value.length > 0) {
          supabase
            .from("messages")
            .insert({
              chat_id: selectedChat.value.id,
              user_id: user.id,
              message: message.value,
            })
            .then(({ data, error }) => {
              if (error) {
                Notify.create({
                  color: "negative",
                  textColor: "white",
                  message: error.message,
                });
              }

              if (data) {
                messages.value.push(data[0]);
                message.value = "";
                focusLastChatMessage();
              }
            });
        }
      },
    };
  },
};
</script>
<style>
.chats-container {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.messages-container {
  max-height: 400px;
  overflow-y: auto;
}
</style>
