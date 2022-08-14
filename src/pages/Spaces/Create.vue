<template>
  <q-page padding>
    <q-form class="q-gutter-md">
      <q-card flat bordered>
        <q-card-section style="height: 200px"> images import </q-card-section>
      </q-card>
      <q-card class="q-mt-md" flat bordered>
        <q-card-section class="q-gutter-md">
          <p class="text-h6">{{ $t("common.basicInformation") }}</p>
          <q-input
            :label="$t('common.description')"
            v-model="space.description"
            outlined
            type="textarea"
          />
          <q-input
            :label="$t('common.phone')"
            v-model="space.phone"
            outlined
            mask="(###) ### - ####"
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
          />
          <q-toggle
            v-model="space.privateOffice"
            :label="$t('common.privateOffice')"
          />
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
            dropdown-icon="eva-arrow-down-outline"
            @filter="filterCountries"
            use-input
          />
          <q-select
            outlined
            v-model="space.city"
            :options="filteredCities"
            :label="$t('common.city')"
            dropdown-icon="eva-arrow-down-outline"
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
              class="full-width"
              color="primary"
              text-color="black"
              :label="$t('action.publish')"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script>
import { ref } from "vue";
import SpaceTypeSelection from "components/Space/TypeSelectionCard.vue";
import LocationPicker from "components/Map/LocationPicker.vue";
import countriesJSON from "assets/countries.min.json";

export default {
  name: "PageCreateSpace",
  components: {
    SpaceTypeSelection,
    LocationPicker,
  },
  setup() {
    const space = ref({
      description: "",
      internet: true,
      internetSpeed: "",
      opensAt: "",
      closesAt: "",
      price: 0,
      country: "",
      city: "",
      location: "",
      phone: "",
      type: "work_space",
      privateOffice: false,
    });

    const countriesArray = Object.keys(countriesJSON).map((key) => key);
    const filteredCountries = ref([]);
    const filteredCities = ref([]);

    return {
      space,
      filteredCountries,
      filteredCities,
      countriesJSON,
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
    };
  },
};
</script>
