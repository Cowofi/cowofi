<template>
  <q-page padding>
    <div class="row justify-center items-center">
      <div class="col-sm-4 col-xs-12">
        <p class="text-h3 text-bold">
          {{ $t("messages.information.findPerfectWorkingSpaceNearYou") }}!
        </p>
        <div v-if="$q.screen.xs">
          <div class="col-xs-12 text-center">
            <q-btn
              push
              color="primary"
              text-color="white"
              rounded
              :label="$t('action.exploreSpaces')"
              icon="eva-search-outline"
              to="/explorer"
            />
            <span class="q-ma-md">{{ $t("common.or") }}</span>
            <q-btn
              push
              color="white"
              rounded
              text-color="black"
              :label="$t('action.postSpace')"
              icon="eva-plus-outline"
              to="/spaces/create"
            />
          </div>
        </div>
        <div v-else>
          <q-btn
            push
            color="primary"
            text-color="white"
            rounded
            :label="$t('action.exploreSpaces')"
            icon="eva-search-outline"
            to="/explorer"
          />
          <span class="q-ma-md">{{ $t("common.or") }}</span>
          <q-btn
            push
            color="white"
            rounded
            text-color="black"
            class="q-mt-md"
            :label="$t('action.postSpace')"
            icon="eva-plus-outline"
            to="/spaces/create"
          />
        </div>
      </div>
      <div class="col-8 text-right">
        <img
          alt="work time illustration"
          src="/images/illustrations/work_time.png"
          :style="{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -5,
            position: 'relative',
            borderRadius: '4px',
          }"
        />
      </div>
    </div>
    <div
      class="bg-secondary q-pa-md q-mt-lg spaceSection"
      style="border-radius: 4px"
    >
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <p class="text-h5 text-white">{{ $t("common.spaceTypes") }}</p>
        </div>
        <div
          class="col-xs-12 col-sm-6 col-md-3"
          v-for="spaceType in spaceTypes"
          :key="spaceType.value"
        >
          <space-type
            :title="spaceType.title"
            :to="`/explorer?type=${spaceType.value}`"
          >
            <template v-slot:img>
              <img
                width="50"
                style="border-radius: 4px; min-height: 38"
                :src="spaceType.img"
              />
            </template>
          </space-type>
        </div>
        <div class="col-12">
          <p class="text-h5 text-white">{{ $t("common.mostRecentSpaces") }}</p>
          <q-scroll-area
            style="height: 280px; max-width: 100%"
            v-if="!loadingSpaces"
          >
            <div class="row no-wrap">
              <div
                style="width: 600px"
                class="q-pa-sm"
                v-for="space in spaces"
                :key="space.id"
              >
                <space-mini class="q-mx-auto" :space="space" />
              </div>
            </div>
          </q-scroll-area>
          <div v-if="loadingSpaces" class="text-center q-my-lg">
            <q-spinner color="primary" size="3em" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onBeforeUnmount } from "vue";
import SpaceType from "components/Space/TypeCard.vue";
import SpaceTypes from "src/utils/spaceTypes";
import supabase from "boot/supabase";
import SpaceMini from "components/Space/SpaceMini.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    SpaceType,
    SpaceMini,
  },
  setup() {
    const spaces = ref([]);
    const loadingSpaces = ref(true);

    const spacesSubscription = supabase
      .from("spaces")
      .on("INSERT", (payload) => {
        supabase
          .from("spaces")
          .select("*, photos(url)")
          .eq("id", payload.new.id)
          .then(({ data }) => {
            if (data) {
              spaces.value.unshift({ ...data[0], isNew: true });
            }
          });
      })
      .subscribe();

    supabase
      .from("spaces")
      .select("*, photos(url)")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) {
          spaces.value = data;
        }
        loadingSpaces.value = false;
      });

    onBeforeUnmount(() => {
      supabase.removeSubscription(spacesSubscription);
    });

    return {
      spaceTypes: SpaceTypes,
      spaces,
      loadingSpaces,
    };
  },
});
</script>
