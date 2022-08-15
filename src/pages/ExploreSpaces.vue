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
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="row">
          <div class="col-12" v-for="space in spaces" :key="space.id">
            <space-mini :space="space" />
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
import supabase from "boot/supabase";
import SpaceMini from "components/Space/SpaceMini.vue";

export default {
  name: "PageExplorer",
  components: {
    SpaceMini,
  },
  setup() {
    const { query } = useRoute();
    const loading = ref(false);
    const showMap = ref(false);
    const type = ref("");
    const country = ref("");
    const city = ref("");
    const spaces = ref([]);

    if (query.type) {
      loading.value = true;
      // fetch the spaces by type
      loading.value = false;
    }

    supabase
      .from("spaces")
      .select("* , photos(url)")
      .then(({ data, error }) => {
        if (error) {
          Notify.create({
            color: "negative",
            message: error.message,
          });
          return;
        }

        spaces.value = data;
      });

    return {
      showMap,
      loading,
      type,
      country,
      city,
      spaces,
    };
  },
};
</script>
