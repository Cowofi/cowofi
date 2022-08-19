<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <q-carousel animated v-model="slide" arrows thumbnails infinite>
          <q-carousel-slide
            v-for="(photo, index) in space.photos"
            :key="index"
            :name="index + 1"
            :img-src="asssetsRoute + photo.url"
          />
        </q-carousel>
      </q-card-section>
      <q-card-section>
        <q-btn
          v-if="authStore.user.id === space.userid"
          :to="'/spaces/edit/' + space.id"
          push
          class="q-mb-md"
          icon="eva-edit-outline"
          color="primary"
          text-color="black"
          :label="$t('action.edit')"
        />
        <p class="text-h5">
          {{ $t("common.basicInformation") }}
        </p>
        <p>
          {{ space.description }}
        </p>
        <p>
          <q-icon size="sm" name="eva-phone-call-outline" />
          {{ space.phone }}
        </p>
        <q-separator />
      </q-card-section>
      <q-card-section>
        <p class="text-h5">
          {{ $t("common.spaceInformation") }}
        </p>
        <div class="text-bold text-h6">${{ space.price }}</div>

        <div class="row q-col-gutter-md items-center q-my-sm" v-if="spaceType">
          <div class="col-xs-2 col-sm-1">
            <img width="50" :src="spaceType.img" />
          </div>
          <div class="col-10">
            {{ spaceType.title }}
            <template v-if="space.private_office">
              -
              <span class="text-primary">{{ $t("common.privateOffice") }}</span>
            </template>
          </div>
        </div>

        <div class="q-my-md">
          <template v-if="space.internet">
            <q-icon size="sm" name="eva-wifi-outline" />
            {{ space.internet_speed }}
          </template>
          <template v-else>
            <q-icon size="sm" name="eva-wifi-off-outline" />
          </template>
        </div>
        <div class="q-mt-sm">
          <q-icon size="sm" name="eva-clock-outline" />
          {{ $t("common.opensAt") }} {{ parseTime(space.opens_at) }} -
          {{ $t("common.closesAt") }} {{ parseTime(space.closes_at) }}
        </div>
        <div class="q-mt-md">
          <q-btn
            class="q-mr-sm"
            unelevated
            v-for="day in space.available_week_days"
            :key="day"
            color="secondary"
            text-color="white"
            :label="getWeekDayLabel(day)"
          />
        </div>
        <div class="q-mt-md">
          <q-btn
            v-if="authStore.user.id !== space.userid"
            @click="
              authStore.user.id
                ? (showScheduleForm = true)
                : $router.push('/login')
            "
            push
            icon="eva-calendar-outline"
            color="primary"
            text-color="white"
            :label="$t('action.reserveSpace')"
          />
          <q-dialog v-model="showScheduleForm">
            <q-card style="width: 700px; max-width: 80vw">
              <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">{{ $t("action.reserveSpace") }}</div>
                <q-space />
                <q-btn
                  icon="eva-close-outline"
                  flat
                  round
                  dense
                  v-close-popup
                />
              </q-card-section>
              <q-card-section>
                <q-icon
                  class="q-mb-xs q-mr-xs"
                  size="xs"
                  color="blue"
                  name="eva-info-outline"
                />
                <span>
                  {{ $t("messages.information.reversationDescription") }}
                </span>
              </q-card-section>

              <q-card-section class="q-pt-md">
                <schedule-form-creation
                  @create-schedule="createSchedule"
                  :loading="loading"
                />
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <p class="text-h5">{{ $t("common.location") }}</p>
        <div class="text-grey text-italic q-my-md">
          {{ space.country }} - {{ space.city }}
        </div>
        <div style="height: 425px; position: relative">
          <viewLocation :coordinates="space.location" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import supabase from "boot/supabase";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Notify } from "quasar";
import { parseTime, weekdays } from "src/utils/time";
import spaceTypes from "src/utils/spaceTypes";
import ViewLocation from "components/Map/ViewLocation.vue";
import { useAuthStore } from "stores/Auth";
import ScheduleFormCreation from "components/Schedule/CreateForm.vue";

export default {
  name: "PageCompleteSpaceDetails",
  components: { ViewLocation, ScheduleFormCreation },
  setup() {
    const loading = ref(true);
    const space = ref({
      photos: [],
      available_week_days: [],
      type: "work_office",
    });
    const spaceId = useRoute().params.spaceId;
    const spaceType = ref(null);
    const showScheduleForm = ref(false);
    const authStore = useAuthStore();

    supabase
      .from("spaces")
      .select("*, photos(url)")
      .eq("id", spaceId)
      .then(({ error, data }) => {
        if (data) {
          space.value = data[0];
          spaceType.value = spaceTypes.find(
            (type) => type.value === space.value.type
          );
        } else {
          Notify.create({
            color: "negative",
            message: error.message,
          });
        }
        loading.value = false;
      });

    return {
      space,
      asssetsRoute:
        process.env.SUPABASE_PROJECT_URL + "/storage/v1/object/public/",
      slide: ref(1),
      parseTime,
      spaceType,
      authStore,
      showScheduleForm,
      loading,
      getWeekDayLabel(day) {
        return weekdays.find((d) => d.value === day).label;
      },
      isDayChecked(day) {
        return space.value.available_week_days.includes(day);
      },
      createSchedule({ fromDate, toDate, fromTime, toTime }) {
        const { id: spaceId } = space.value;

        loading.value = true;
        supabase
          .from("schedules")
          .insert({
            space_id: spaceId,
            from_date: fromDate,
            to_date: toDate,
            from_time: fromTime,
            to_time: toTime,
          })
          .then(({ error, data }) => {
            if (data) {
              Notify.create({
                color: "positive",
                message: "Schedule created successfully",
              });
              showScheduleForm.value = false;
            } else {
              Notify.create({
                color: "negative",
                message: error.message,
              });
            }
          })
          .finally(() => {
            loading.value = false;
          });
      },
    };
  },
};
</script>
