<template>
  <q-toolbar
    :class="`${
      $q.dark.isActive ? 'bg-dark text-white' : 'bg-white'
    } constrain-width`"
  >
    <q-toolbar-title>
      <q-img
        src="/logotipo_vector.png"
        spinner-color="white"
        style="max-width: 120px"
        class="q-ma-xs cursor-pointer"
        @click="$router.push('/')"
      />
    </q-toolbar-title>
    <q-btn
      v-for="link in essentialLinks"
      :key="link.title"
      stretch
      flat
      :text-color="$q.dark.isActive ? 'white' : 'secondary'"
      :label="link.title"
      :to="link.route"
    />
    <template v-if="authStore.user.id">
      <q-btn
        stretch
        flat
        to="/messages"
        :text-color="$q.dark.isActive ? 'white' : 'secondary'"
        class="q-ml-md"
        :label="$t('common.messages')"
      />
      <q-btn
        stretch
        flat
        :text-color="$q.dark.isActive ? 'white' : 'secondary'"
        :label="$t('common.profile')"
        :to="'/profile'"
      />
      <q-avatar
        class="cursor-pointer q-ml-xs"
        color="primary"
        text-color="white"
      >
        {{ authStore.user.user_metadata.full_name.substring(0, 1) }}
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section @click="logout()">{{
                $t("common.logout")
              }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-avatar>
      <q-avatar
        class="cursor-pointer q-ml-xs"
        :color="$q.dark.isActive ? 'white' : 'grey-3'"
        text-color="black"
        @click="handleFetchNotifications"
      >
        <q-icon name="eva-bell-outline" />
        <q-badge v-show="hasUnreadNotifications" color="red" rounded floating>
        </q-badge>
        <q-menu>
          <template v-if="loadingNotifications">
            <div
              style="min-width: 300px; min-height: 300px; position: relative"
            >
              <q-spinner
                color="primary"
                size="3em"
                style="position: absolute; top: 45%; left: 45%"
              />
            </div>
          </template>
          <template v-else>
            <template v-if="notifications.length > 0">
              <div
                style="min-width: 300px; min-height: 300px; position: relative"
              >
                <div class="text-right">
                  <q-btn
                    @click="handleReadAllNotifications"
                    :loading="loadingReadAllNotifications"
                    flat
                    color="primary"
                    :label="$t('action.markAllAsRead')"
                  />
                </div>
                <q-list bordered separator>
                  <q-item
                    clickable
                    v-ripple
                    v-for="notification in notifications"
                    :key="notification.id"
                  >
                    <q-item-section>
                      <q-badge
                        color="primary"
                        v-show="!notification.read"
                        floating
                        rounded
                        style="top: 35%; right: 2%"
                      />
                      {{
                        notification.type === "message"
                          ? `USERNAME ${$t("common.userSentYouAMessage")}`
                          : "New follower"
                      }}
                      <q-item-label class="text-grey-6" caption>
                        {{ getTimeAgo(notification.created_at) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </template>
            <template v-else>
              <div
                style="min-width: 300px; min-height: 300px; position: relative"
              >
                <p
                  style="position: absolute; top: 45%; left: 35%"
                  class="text-grey-6"
                >
                  {{ $t("messages.information.noNotifications") }}
                </p>
                <img
                  style="position: absolute; left: 35%; top: 10%"
                  src="/images/illustrations/no_results.png"
                  width="100"
                  alt="not found"
                />
              </div>
            </template>
          </template>
        </q-menu>
      </q-avatar>
    </template>
    <template v-else>
      <q-btn
        push
        to="/auth/login"
        color="primary"
        text-color="white"
        class="q-ml-md"
        :label="$t('common.joinNow')"
      />
    </template>
    <q-toggle
      color="primary"
      dark
      v-model="darkMode"
      :icon="darkMode ? 'eva-moon-outline' : 'eva-sun-outline'"
      @update:model-value="toggleDarkMode"
    />
  </q-toolbar>
</template>

<script>
import { ref, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "stores/Auth";
import supabase from "boot/supabase";
import { useRouter } from "vue-router";
import { timeAgo } from "src/utils/time";

export default {
  name: "ComponentDesktopMenu",
  setup() {
    const darkmodeFromLocalStorage = localStorage.getItem("darkmode");
    const $q = useQuasar();

    const $t = useI18n().t;
    const authStore = useAuthStore();
    const loading = ref(false);
    const loadingNotifications = ref(false);
    const loadingReadAllNotifications = ref(false);
    const notifications = ref([]);
    const $router = useRouter();
    const darkMode = ref(darkmodeFromLocalStorage || $q.dark.isActive);
    const linksList = [
      {
        title: $t("common.home"),
        route: "/",
      },
      {
        title: $t("common.explorer"),
        route: "/explorer",
      },
    ];
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notification")
        .select("*")
        .eq("to_user", authStore.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      }
      notifications.value = data;

      return;
    };

    const notificationsSubscription = supabase
      .from("notification")
      .on("INSERT", (payload) => {
        console.log(payload);
      })
      .subscribe();

    onBeforeUnmount(() => {
      supabase.removeSubscription(notificationsSubscription);
    });

    if (authStore.user.id) {
      fetchNotifications();
    }

    return {
      essentialLinks: linksList,
      authStore,
      loading,
      darkMode,
      loadingNotifications,
      notifications,
      loadingReadAllNotifications,
      hasUnreadNotifications() {
        return notifications.value.some((notification) => {
          return notification.read === false;
        });
      },
      async logout() {
        loading.value = true;
        await supabase.auth.signOut();
        authStore.logout();
        loading.value = false;
        $router.push("/");
      },
      async handleFetchNotifications() {
        loadingNotifications.value = true;

        await fetchNotifications();

        loadingNotifications.value = false;
      },
      toggleDarkMode() {
        window.localStorage.setItem("darkMode", darkMode.value);
        $q.dark.set(darkMode.value);
      },
      getTimeAgo(time) {
        return timeAgo(time);
      },
      handleReadAllNotifications() {
        loadingReadAllNotifications.value = true;

        setTimeout(() => {
          loadingReadAllNotifications.value = false;
        }, 2000);
      },
    };
  },
};
</script>
