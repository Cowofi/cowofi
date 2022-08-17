<template>
  <q-page padding>
    <div class="row justify-center items-center">
      <div class="col-4">
        <p class="text-h3 text-bold">
          {{ $t("messages.information.findPerfectWorkingSpaceNearYou") }}!
        </p>
        <q-btn
          color="primary"
          text-color="white"
          :label="$t('action.exploreSpaces')"
          icon="eva-search-outline"
          rounded
          push
          to="/explorer"
        />
      </div>
      <div class="col-8 text-right">
        <img
          alt="work time illustration"
          src="/images/illustrations/work_time.png"
          style="width: 600px"
        />
      </div>
    </div>
    <div class="bg-teal-10 q-pa-md spaceSection">
      <div class="row">
        <p class="text-h5 text-bold text-white">
          {{ $t("messages.information.startYourSearch") }}!
        </p>
      </div>
      <div class="row">
        <div class="col-12">
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
  margin: -19px;
  margin-top: 10px;
  min-height: calc(100vh - 64px);
}
</style>
