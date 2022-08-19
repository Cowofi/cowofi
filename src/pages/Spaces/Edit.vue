<template>
  <q-page padding>
    <q-form @submit="submit" class="q-gutter-md">
      <q-card flat bordered>
        <q-card-section>
          <image-loader
            @files="saveLocalImages"
            @removed="saveLocalImagesToDelete"
            :input-photos="space.photos"
          />
        </q-card-section>
      </q-card>
      <q-card class="q-mt-md" flat bordered>
        <q-card-section class="q-gutter-md">
          <p class="text-h6">{{ $t("common.basicInformation") }}</p>
          <q-input
            :label="$t('common.description')"
            v-model="space.description"
            outlined
            type="textarea"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                $t('messages.error.pleaseEnterADescription'),
            ]"
          />
          <q-input
            :label="$t('common.phone')"
            v-model="space.phone"
            outlined
            mask="(###) ### - ####"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                $t('messages.error.pleaseEnterValidPhoneNumber'),
            ]"
          />
        </q-card-section>
      </q-card>
      <q-card class="q-mt-md" flat bordered>
        <q-card-section class="q-gutter-md">
          <p class="text-h6">{{ $t("common.spaceInformation") }}</p>

          <q-input
            :label="$t('common.price')"
            v-model="space.price"
            outlined
            type="number"
            :rules="[
              (val) =>
                (val && val > 0) || $t('messages.error.pleaseEnterPrice'),
            ]"
          />

          <div class="q-my-md">
            <div class="row q-col-gutter-sm">
              <div
                class="col-3"
                v-for="spaceType in spaceTypes"
                :key="spaceType.value"
              >
                <space-type-selection
                  :title="spaceType.title"
                  @click="space.type = spaceType.value"
                >
                  <template v-slot:img>
                    <img width="50" :src="spaceType.img" />
                  </template>
                  <template v-slot:selection>
                    <q-radio
                      v-model="space.type"
                      :val="spaceType.value"
                      :label="spaceType.title"
                    />
                  </template>
                </space-type-selection>
              </div>
            </div>
          </div>
          <q-toggle v-model="space.internet" label="Internet" />
          <q-input
            outlined
            v-model="space.internetSpeed"
            :label="$t('common.internetSpeed')"
            :hint="$t('messages.information.internetSpeedExample')"
          />
          <q-toggle
            v-model="space.privateOffice"
            :label="$t('common.privateOffice')"
          />
          <div class="q-gutter-sm row">
            <q-input
              outlined
              v-model="space.opensAt"
              mask="time"
              :rules="['time']"
              :label="$t('common.opensAt')"
            >
              <template v-slot:append>
                <q-icon name="eva-clock-outline" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="space.opensAt">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              outlined
              v-model="space.closesAt"
              mask="time"
              :rules="['time']"
              :label="$t('common.closesAt')"
            >
              <template v-slot:append>
                <q-icon name="eva-clock-outline" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="space.closesAt">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div>
            <q-btn
              class="q-mr-sm"
              unelevated
              v-for="day in weekdays"
              :key="day.value"
              :color="isDayChecked(day.value) ? 'primary' : 'grey-3'"
              :text-color="isDayChecked(day.value) ? 'white' : 'black'"
              :label="day.label"
              @click="toggleDay(day.value)"
            />
          </div>
        </q-card-section>
      </q-card>
      <q-card class="q-mt-md" flat bordered>
        <q-card-section class="q-gutter-md">
          <p class="text-h6">{{ $t("common.location") }}</p>
          <q-select
            outlined
            v-model="space.country"
            :options="filteredCountries"
            :label="$t('common.country')"
            @filter="filterCountries"
            use-input
          />
          <q-select
            outlined
            v-model="space.city"
            :options="filteredCities"
            :label="$t('common.city')"
            @filter="filterCities"
            use-input
          />
          <div
            style="
              height: 350px;
              border: 1px solid grey;
              position: relative;
              border-radius: 4px;
            "
          >
            <location-picker
              class="bg-white"
              :lngLat="space.location"
              @location="
                (coordinates) =>
                  (space.location = `${coordinates.latitude},${coordinates.longitude}`)
              "
            />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <q-btn
              :loading="loading"
              class="full-width"
              color="primary"
              text-color="black"
              :label="$t('action.publish')"
              type="submit"
              icon="eva-paper-plane-outline"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-form>
    <q-dialog maximized v-model="success">
      <q-card>
        <q-card-section class="text-center">
          <img src="/images/illustrations/success_publish.png" width="400" />
        </q-card-section>

        <q-card-section class="text-center">
          <p class="text-h5">
            {{ $t("messages.information.youSpaceIsNowAvailable") }}!
          </p>
          <p>{{ $t("messages.information.afterPublishMessage") }}!</p>
        </q-card-section>

        <q-card-section class="text-center q-gutter-md">
          <q-btn
            push
            color="white"
            text-color="black"
            :label="$t('action.goHome')"
            to="/"
          />
          <q-btn
            :to="`/spaces/view/${space.id}`"
            push
            color="primary"
            text-color="black"
            :label="$t('action.viewSpace')"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { Notify } from "quasar";
import SpaceTypeSelection from "components/Space/TypeSelectionCard.vue";
import LocationPicker from "components/Map/LocationPicker.vue";
import countriesJSON from "assets/countries.min.json";
import supabase from "boot/supabase";
import imageLoader from "components/Space/ImageLoader.vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "stores/Auth";

export default {
  name: "PageEditSpace",
  components: {
    SpaceTypeSelection,
    LocationPicker,
    imageLoader,
  },
  setup() {
    const space = ref({
      description: "",
      internet: true,
      internetSpeed: "",
      opensAt: "09:00",
      closesAt: "17:00",
      availableWeekDays: [],
      price: 0,
      country: "",
      city: "",
      location: "",
      phone: "",
      type: "work_space",
      privateOffice: false,
    });
    const success = ref(false);
    const countriesArray = Object.keys(countriesJSON).map((key) => key);
    const filteredCountries = ref([]);
    const filteredCities = ref([]);
    const loading = ref(false);
    const spaceImages = ref([]);
    const router = useRouter();
    const spaceId = useRoute().params.spaceId;
    const authStore = useAuthStore();
    const asssetsRoute =
      process.env.SUPABASE_PROJECT_URL + "/storage/v1/object/public/";
    const imagesToDelete = ref([]);

    supabase
      .from("spaces")
      .select("*, photos(id, url)")
      .eq("id", spaceId)
      .then(({ error, data }) => {
        if (data) {
          if (data[0].userid !== authStore.user.id) {
            Notify.create({
              color: "negative",
              textColor: "white",
              message: "You are not allowed to edit this space",
            });
            router.push("/");
          }

          space.value = {
            ...data[0],
            opensAt: data[0].opens_at,
            closesAt: data[0].closes_at,
            privateOffice: data[0].private_office,
            internetSpeed: data[0].internet_speed,
            availableWeekDays: data[0].available_week_days,
          };

          space.value.photos = data[0].photos.map((photo) => {
            return {
              url: asssetsRoute + photo.url,
              id: photo.id,
            };
          });
        } else {
          Notify.create({
            color: "negative",
            message: error.message,
          });
        }
        loading.value = false;
      });

    const uploadImages = async (spaceId) => {
      const publicUrl = [];

      for (let image of spaceImages.value) {
        if (image.id) {
          // jump to next image if image is already uploaded
          continue;
        }

        const { data, error } = await supabase.storage
          .from("spaces-images")
          .upload(image.name, image.file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (data) {
          publicUrl.push({ space_id: spaceId, url: data.Key });
        }
      }

      await supabase.from("photos").insert(publicUrl);

      return;
    };

    return {
      space,
      filteredCountries,
      filteredCities,
      countriesJSON,
      success,
      loading,
      spaceImages,
      spaceTypes: [
        {
          img: "/images/illustrations/co-working.png",
          title: "Work Space",
          value: "work_space",
        },
        {
          img: "/images/illustrations/chill_zone.png",
          title: "Chill Zone",
          value: "chill_zone",
        },
        {
          img: "/images/illustrations/coffee.png",
          title: "Coffee Shop",
          value: "coffee_shop",
        },
        {
          img: "/images/illustrations/eating.png",
          title: "Restaurant",
          value: "restaurant",
        },
      ],
      weekdays: [
        {
          label: "Monday",
          value: "monday",
        },
        {
          label: "Tuesday",
          value: "tuesday",
        },
        {
          label: "Wednesday",
          value: "wednesday",
        },
        {
          label: "Thursday",
          value: "thursday",
        },
        {
          label: "Friday",
          value: "friday",
        },
        {
          label: "Saturday",
          value: "saturday",
        },
        {
          label: "Sunday",
          value: "sunday",
        },
      ],
      toggleDay(day) {
        space.value.availableWeekDays.includes(day)
          ? space.value.availableWeekDays.splice(
              space.value.availableWeekDays.indexOf(day),
              1
            )
          : space.value.availableWeekDays.push(day);
      },
      isDayChecked(day) {
        return space.value.availableWeekDays.includes(day);
      },
      filterCountries(val, update) {
        if (val === "") {
          update(() => {
            filteredCountries.value = countriesArray;
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          filteredCountries.value = countriesArray.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      },
      filterCities(val, update) {
        if (val === "") {
          update(() => {
            filteredCities.value = countriesJSON[space.value.country];
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          filteredCities.value = countriesJSON[space.value.country].filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      },
      async submit() {
        loading.value = true;
        const { data, error } = await supabase
          .from("spaces")
          .update({
            description: space.value.description,
            phone: space.value.phone,
            price: space.value.price,
            type: space.value.type,
            internet: space.value.internet,
            internet_speed: space.value.internetSpeed,
            private_office: space.value.privateOffice,
            opens_at: space.value.opensAt,
            closes_at: space.value.closesAt,
            available_week_days: space.value.availableWeekDays,
            country: space.value.country,
            city: space.value.city,
            location: space.value.location,
          })
          .match({ id: space.value.id });

        if (error) {
          Notify.create({
            color: "negative",
            textColor: "white",
            message: error.message,
          });
          return;
        }

        if (data) {
          uploadImages(data[0].id);
          success.value = true;
        }

        if (imagesToDelete.value.length > 0) {
          imagesToDelete.value.forEach(async (image) => {
            await supabase.from("photos").delete().match({ id: image.id });
          });
        }

        setTimeout(() => {
          loading.value = false;
        }, 3000);
      },
      saveLocalImages(images) {
        spaceImages.value = images;
      },
      saveLocalImagesToDelete(image) {
        if (image.id) {
          imagesToDelete.value.push(image);
        }
      },
    };
  },
};
</script>
