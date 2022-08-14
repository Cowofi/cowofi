<template>
  <q-page padding>
    <q-card bordered flat>
      <q-card-section>
        <div class="q-gutter-md row">
          <q-select
            square
            outlined
            v-model="type"
            :options="[]"
            :label="$t('common.type')"
            style="width: 250px"
            dropdown-icon="eva-arrow-down-outline"
          />
          <q-select
            square
            outlined
            v-model="country"
            :options="[]"
            :label="$t('common.country')"
            style="width: 250px"
            dropdown-icon="eva-arrow-down-outline"
          />
          <q-select
            square
            outlined
            v-model="city"
            :options="[]"
            :label="$t('common.city')"
            style="width: 250px"
            dropdown-icon="eva-arrow-down-outline"
          />
          <q-space />
          <q-toggle v-model="showMap" :label="$t('action.showMap')" />
        </div>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="q-mt-md">
      <div class="row q-col-gutter-md">
        <div class="col-6">Map</div>
        <div class="col-6">
          <q-card-section>
            <div class="row">
              <div class="col-12">
                <p class="text-h5">
                  {{ $t("common.coworkingSpaceIn") }} {{ city }}
                </p>
              </div>
            </div>
          </q-card-section>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { ref } from "vue";

export default {
  name: "PageExplorer",
  setup() {
    const { query } = useRoute();
    const loading = ref(false);
    const showMap = ref(false);
    const type = ref("");
    const country = ref("");
    const city = ref("");

    if (query.type) {
      loading.value = true;
      // fetch the articles by type
      loading.value = false;
    }

    return {
      showMap,
      loading,
      type,
      country,
      city,
    };
  },
};
</script>
