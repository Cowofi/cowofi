<template>
  <q-page padding>
    <div class="row justify-center items-center">
      <div class="col-4">
        <p class="text-h3 text-bold">
          {{ $t("messages.information.findPerfectWorkingSpaceNearYou") }}!
        </p>
      </div>
      <div class="col-8 text-right">
        <img
          alt="work time illustration"
          src="/images/illustrations/work_time.png"
          style="width: 600px"
        />
      </div>
    </div>
    <div class="bg-secondary q-pa-md">
      <div class="row">
        <div class="col-12">
          <space-type
            :title="$t('common.chillOutZone')"
            to="/explorer?type=chill-out-zone"
          >
            <template v-slot:img>
              <img width="50" src="/images/illustrations/chill_zone.png" />
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

export default defineComponent({
  name: "IndexPage",
  components: {
    SpaceType,
  },
});
</script>
