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
            :options="[]"
            :label="$t('common.country')"
            style="width: 250px"
            dropdown-icon="eva-arrow-down-outline"
          />
          <q-select
            outlined
            v-model="city"
            :options="[]"
            :label="$t('common.city')"
            style="width: 250px"
            dropdown-icon="eva-arrow-down-outline"
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
      <q-card-section>
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

    if (query.type) {
      if (spaceTypes.find((t) => t.value === query.type)) {
        type.value = query.type;
      }
    }

    const findSpaces = async ({ type }) => {
      loading.value = true;
      let query = supabase.from("spaces").select("* , photos(url)");

      if (type !== "All") {
        query = query.eq("type", type);
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
      spaces,
      spaceTypes: [
        { value: "All", title: $t("common.allTypes") },
        ...spaceTypes,
      ],
      onChangeType(type) {
        findSpaces({ type });
      },
    };
  },
};
</script>
