<template>
  <q-page padding>
    <div v-if="space === undefined">
      <notFound />
    </div>
    <div v-else>
      <q-card flat bordered>
        <q-card-section class="relative-position">
          <ShareButton :placeToShare="{ space }" />
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
          <q-separator class="q-my-md" />
          <div class="space-owner" v-if="space.users">
            <p class="text-h5">
              {{ space.users.raw_user_meta_data.full_name }}
              <q-btn
                push
                icon="eva-message-circle-outline"
                color="primary"
                text-color="white"
                :label="$t('action.sendMessage')"
                :to="'/messages/' + space.userid"
              />
            </p>
          </div>
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

          <div
            class="row q-col-gutter-md items-center q-my-sm"
            v-if="spaceType"
          >
            <div class="col-xs-2 col-sm-1">
              <img
                width="50"
                style="height: 38px; border-radius: 4px"
                :src="spaceType.img"
              />
            </div>
            <div class="col-10">
              {{ spaceType.title }}
              <template v-if="space.private_office">
                -
                <span class="text-primary">{{
                  $t("common.privateOffice")
                }}</span>
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
              class="q-mr-sm q-my-xs"
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
              <q-card style="width: 400px; max-width: 80vw">
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
                    :availableWeekDays="space.available_week_days"
                    :opensAt="space.opens_at"
                    :closesAt="space.closes_at"
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
      <q-card flat bordered class="q-mt-md">
        <q-card-section>
          <p class="text-h5">{{ $t("common.reviews") }}</p>
          <div class="row">
            <template v-if="loadingReviews">
              <div class="col-12" v-for="i in 4" :key="i">
                <q-item>
                  <q-item-section avatar>
                    <q-skeleton type="QAvatar" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      <q-skeleton width="150px" type="text" />
                    </q-item-label>
                    <q-item-label caption>
                      <q-skeleton width="150px" type="text" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </template>
            <template v-else-if="reviews.length > 0">
              <div class="col-12" v-for="review in reviews" :key="review.id">
                <review-card :review="review" />
              </div>
            </template>
            <template v-else>
              <div class="col-12">
                <div class="text-grey text-italic q-my-md">
                  {{ $t("messages.information.noReviewsYet") }}
                </div>
              </div>
            </template>
          </div>
        </q-card-section>
      </q-card>
      <q-dialog v-model="showReviewForm">
        <q-card style="width: 400px; max-width: 80vw">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ $t("common.giveFeedback") }}</div>
            <q-space />
            <q-btn icon="eva-close-outline" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pt-md">
            <review-form
              :loading="loadingReviewSubmit"
              @on-created="handleSubmitReview"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showScheduleSuccess">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-center">{{$t('messages.information.scheduleCreatedSuccessfully')}}</div>
          </q-card-section>
          <q-card-section>
            <img
              src="/images/illustrations/confirmation.png"
              width="250"
              style="margin: auto; display: block"
            />
            <p>
              {{ $t("messages.information.scheduleCreatedDescription") }}
            </p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              :label="$t('action.close')"
              color="primary"
              v-close-popup
            />
            <q-btn
              push
              :label="$t('action.goToProfile')"
              color="primary"
              to="/profile"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import supabase from "boot/supabase";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Notify } from "quasar";
import { parseTime, weekdays } from "src/utils/time";
import spaceTypes from "src/utils/spaceTypes";
import notFound from "components/Interface/404.vue";
import ViewLocation from "components/Map/ViewLocation.vue";
import { useAuthStore } from "stores/Auth";
import ScheduleFormCreation from "components/Schedule/CreateForm.vue";
import ReviewForm from "components/Reviews/CreateForm.vue";
import ReviewCard from "components/Reviews/ReviewCard.vue";
import ShareButton from "components/buttons/ShareButton.vue";

export default {
  name: "PageCompleteSpaceDetails",
  components: {
    ViewLocation,
    ScheduleFormCreation,
    notFound,
    ReviewForm,
    ReviewCard,
    ShareButton,
  },
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
    const notFound = ref(false);
    const showReviewForm = ref(false);
    const loadingReviewSubmit = ref(false);
    const reviews = ref([]);
    const loadingReviews = ref(true);
    const showScheduleSuccess = ref(false);

    const fetchScheduleByTheLoggedUser = async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .eq("user_id", authStore.user.id)
        .eq("space_id", spaceId);

      if (error) {
        Notify.create({
          message: error.message,
          color: "negative",
        });
      }

      if (data && data[0] && data[0].status === "pending") {
        showReviewForm.value = true;
      }
    };

    supabase
      .from("spaces")
      .select("*, photos(url), users(raw_user_meta_data)")
      .eq("id", spaceId)
      .then(({ error, data }) => {
        if (data) {
          space.value = data[0];
          spaceType.value = spaceTypes.find(
            (type) => type.value === space.value.type
          );

          supabase
            .from("reviews")
            .select("*, users(raw_user_meta_data)")
            .eq("space_id", spaceId)
            .then(({ data }) => {
              if (data) {
                reviews.value = data;
              }
              loadingReviews.value = false;
            });
        } else {
          notFound.value = True;
          Notify.create({
            color: "negative",
            message: error.message,
          });
        }
        loading.value = false;

        if (authStore.user && authStore.user.id) {
          fetchScheduleByTheLoggedUser();
        }
      });

    return {
      space,
      asssetsRoute:
        process.env.SUPABASE_PROJECT_URL + "/storage/v1/object/public/",
      slide: ref(1),
      parseTime,
      notFound,
      spaceType,
      authStore,
      showScheduleForm,
      loading,
      showReviewForm,
      loadingReviewSubmit,
      reviews,
      loadingReviews,
      ShareButton,
      showScheduleSuccess,
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
              showScheduleForm.value = false;
              showScheduleSuccess.value = true;
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
      handleSubmitReview({ rating, comment }) {
        const { id } = space.value;
        loadingReviewSubmit.value = true;
        supabase
          .from("reviews")
          .insert({
            space_id: id,
            rating,
            comment,
          })
          .then(({ error, data }) => {
            if (data) {
              Notify.create({
                color: "positive",
                message: "Review created successfully",
              });
              showReviewForm.value = false;
            } else {
              Notify.create({
                color: "negative",
                message: error.message,
              });
            }
          })
          .finally(() => {
            loadingReviewSubmit.value = false;
          });
      },
    };
  },
};
</script>
