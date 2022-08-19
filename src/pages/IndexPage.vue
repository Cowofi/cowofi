<template>
  <q-page padding>
    <div class="row justify-center items-center">
      <div class="col-sm-4 col-xs-12">
        <p class="text-h3 text-bold">
          {{ $t("messages.information.findPerfectWorkingSpaceNearYou") }}!
        </p>
        <div :class="$q.screen.xs ? 'col-xs-12 text-center' : ''">
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
            :class="$q.screen.sm ? 'q-mt-md' : ''"
            text-color="black"
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
          }"
        />
      </div>
    </div>
    <div class="bg-secondary q-pa-md q-mt-lg spaceSection">
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
              <img width="50" :src="spaceType.img" />
            </template>
          </space-type>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import SpaceType from "components/Space/TypeCard.vue";
import SpaceTypes from "src/utils/spaceTypes";

export default defineComponent({
  name: "IndexPage",
  components: {
    SpaceType,
  },
  setup() {
    return {
      spaceTypes: SpaceTypes,
    };
  },
});
</script>

<style scoped>
.spaceSection {
  min-height: 1000px;
  margin: -20px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
