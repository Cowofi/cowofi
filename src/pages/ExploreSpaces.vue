<template>
  <q-page padding>
    <q-card bordered flat>
      <q-card-section>
        <div class="q-gutter-md row">
          <q-select
            outlined
            v-model="type"
            :options="spaceTypes"
            emit-value
            map-options
            option-value="value"
            option-label="title"
            :label="$t('common.type')"
            style="width: 250px"
            dropdown-icon="eva-arrow-down-outline"
            @update:model-value="onChangeType"
          />
          <q-select
            outlined
            v-model="country"
            :options="filteredCountries"
            :label="$t('common.country')"
            style="width: 250px"
            @filter="filterCountries"
            use-input
            @update:model-value="onChangeCountry"
          />
          <q-select
            outlined
            v-model="city"
            :options="filteredCities"
            :label="$t('common.city')"
            style="width: 250px"
            @filter="filterCities"
            use-input
            @update:model-value="onChangeCity"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="q-my-md">
      <q-card-section>
        <p class="text-h5 q-mt-md">
          {{ $t("common.coworkingSpaceIn") }}
          <span class="text-bold">
            {{ city || $t("common.allCities") }}
          </span>
        </p>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="q-mt-md">
      <q-card-section
        v-if="spaces.length === 0 && !loading"
        class="text-center"
      >
        <img
          src="images/illustrations/no_results.png"
          alt="empty"
          width="200"
        />
        <p>{{ $t("messages.information.noSpaceFound") }}...</p>
      </q-card-section>
      <q-card-section v-if="spaces.length > 0">
        <div class="row q-col-gutter-md">
          <div class="col-12" v-for="space in spaces" :key="space.id">
            <space-mini class="q-mx-auto" :space="space" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { Notify } from "quasar";
import { useI18n } from "vue-i18n";
import supabase from "boot/supabase";
import SpaceMini from "components/Space/SpaceMini.vue";
import spaceTypes from "src/utils/spaceTypes";
import countriesJSON from "assets/countries.min.json";

export default {
  name: "PageExplorer",
  components: {
    SpaceMini,
  },
  setup() {
    const { query } = useRoute();
    const loading = ref(false);
    const showMap = ref(false);
    const type = ref("All");
    const country = ref("All");
    const city = ref("All");
    const spaces = ref([]);
    const $t = useI18n().t;
    const countriesArray = Object.keys(countriesJSON).map((key) => key);
    const filteredCountries = ref([]);
    const filteredCities = ref([]);

    if (query.type) {
      if (spaceTypes.find((t) => t.value === query.type)) {
        type.value = query.type;
      }
    }

    const findSpaces = async ({ type, country, city }) => {
      loading.value = true;
      let query = supabase.from("spaces").select("* , photos(url)");

      if (type !== "All" && type !== undefined) {
        query = query.eq("type", type);
      }

      if (country !== "All" && country !== undefined) {
        query = query.eq("country", country);
      }

      if (city !== "All" && city !== undefined) {
        query = query.eq("city", city);
      }

      const { data, error } = await query;
      if (error) {
        Notify.create({
          color: "negative",
          message: error.message,
        });
        return;
      }

      spaces.value = data;
      loading.value = false;
    };

    findSpaces({ type: type.value });

    return {
      showMap,
      loading,
      type,
      country,
      city,
      filteredCountries,
      filteredCities,
      spaces,
      spaceTypes: [{ value: "All", title: $t("common.all") }, ...spaceTypes],
      filterCountries(val, update) {
        if (val === "") {
          update(() => {
            filteredCountries.value = ["All", ...countriesArray];
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
            filteredCities.value = ["All", ...countriesJSON[country.value]];
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          filteredCities.value = countriesJSON[country.value].filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      },
      onChangeType(type) {
        findSpaces({ type, country: country.value, city: city.value });
      },
      onChangeCountry(country) {
        findSpaces({ type: type.value, city: city.value, country });
      },
      onChangeCity(city) {
        findSpaces({ type: type.value, country: country.value, city });
      },
    };
  },
};
</script>
