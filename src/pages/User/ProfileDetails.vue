<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <p class="text-h4">{{ user.user_metadata.full_name }}</p>
            <span>{{ user.email }}</span>
            <q-chip
              v-if="user.user_metadata.email_verified"
              :color="user.user_metadata.email_verified ? 'primary' : 'warning'"
              :text-color="
                user.user_metadata.email_verified ? 'white' : 'black'
              "
              size="10px"
            >
              {{
                user.user_metadata.email_verified
                  ? $t("common.verified")
                  : $t("common.notVerified")
              }}
            </q-chip>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-md-8">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-card flat bordered>
              <q-card-section>
                <p class="text-h5">
                  {{ $t("common.spaces") }} ({{ spaces.length }})
                </p>
                <div v-if="loadingSpaces" class="text-center q-my-lg">
                  <q-spinner color="primary" size="3em" />
                </div>
                <div class="row q-col-gutter-md spaces-container">
                  <div class="col-12" v-for="space in spaces" :key="space.id">
                    <space-mini class="q-mx-auto" :space="space" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 schedules-container">
            <q-card flat bordered>
              <q-card-section>
                <p class="text-h5">{{ $t("common.schedules") }}</p>
                <div v-if="loadingSchedules" class="text-center q-my-lg">
                  <q-spinner color="primary" size="3em" />
                </div>
                <div v-for="schedule in schedules" :key="schedule.id">
                  {{ schedule }}
                </div>
                <p>{{ $t("common.mySpaceSchedules") }}</p>
                <div
                  v-for="schedule in schedulesForMySpaces"
                  :key="schedule.id"
                  class="q-my-md"
                >
                  <schedule-mini-card :schedule="schedule" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { Notify } from "quasar";
import { useAuthStore } from "src/stores/Auth";
import supabase from "boot/supabase";
import SpaceMini from "components/Space/SpaceMini.vue";
import ScheduleMiniCard from "components/Schedule/MiniCard.vue";

export default {
  name: "PageUserProfile",
  components: {
    SpaceMini,
    ScheduleMiniCard,
  },
  setup() {
    const { user } = useAuthStore();
    const spaces = ref([]);
    const schedules = ref([]);
    const schedulesForMySpaces = ref([]);
    const loadingSpaces = ref(true);
    const loadingSchedules = ref(true);

    supabase
      .from("spaces")
      .select("*, photos(url)")
      .eq("userid", user.id)
      .then(({ data, error }) => {
        if (error) {
          Notify.create({
            color: "negative",
            textColor: "white",
            message: error.message,
          });
        } else {
          spaces.value = data;
        }
        loadingSpaces.value = false;
      });

    supabase
      .from("schedules")
      .select()
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (error) {
          Notify.create({
            color: "negative",
            textColor: "white",
            message: error.message,
          });
        } else {
          schedules.value = data;
        }
        loadingSchedules.value = false;
      });

    supabase
      .from("schedules")
      .select("*, spaces(*, photos(url)), users(raw_user_meta_data)")
      .eq("spaces.userid", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          Notify.create({
            color: "negative",
            textColor: "white",
            message: error.message,
          });
        } else {
          schedulesForMySpaces.value = data;
        }
        loadingSchedules.value = false;
      });

    return {
      spaces,
      schedules,
      schedulesForMySpaces,
      user,
      loadingSpaces,
      loadingSchedules,
    };
  },
};
</script>
<style>
.spaces-container {
  max-height: 400px;
  overflow-y: auto;
}
.schedules-container {
  min-height: 250px;
}
</style>
