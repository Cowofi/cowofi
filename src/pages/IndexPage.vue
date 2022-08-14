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
          src="~assets/illustrations/work_time.png"
          style="width: 600px"
        />
      </div>
    </div>
    <div class="bg-secondary q-pa-md">
      <div class="row">
        <div class="col-12">
          <article-type :title="$t('common.chillOutZone')">
            <template v-slot:img>
              <img width="50" src="~assets/illustrations/chill_zone.png" />
            </template>
          </article-type>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import ArticleType from "components/Article/TypeCard.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    ArticleType,
  },
});
</script>
