<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <q-carousel animated v-model="slide" arrows thumbnails infinite>
          <q-carousel-slide
            v-for="(photo, index) in space.photos"
            :key="index"
            :name="index + 1"
            :img-src="asssetsRoute + photo.url"
          />
        </q-carousel>
      </q-card-section>
      <q-card-section>
        <p class="text-h5">
          {{ $t("common.basicInformation") }}
        </p>
        <p>
          {{ space.description }}
        </p>
        <p>
          <q-icon size="sm" name="eva-phone-call-outline" />
          {{ space.phone }}
        </p>
        <q-separator />
      </q-card-section>
      <q-card-section>
        <p class="text-h5">
          {{ $t("common.spaceInformation") }}
        </p>
        <div class="text-bold text-h6">${{ space.price }}</div>

        <div class="row q-col-gutter-md items-center q-my-sm" v-if="spaceType">
          <div class="col-xs-2 col-sm-1">
            <img width="50" :src="spaceType.img" />
          </div>
          <div class="col-10">
            {{ spaceType.title }}
            <template v-if="space.private_office">
              <q-chip
                color="primary"
                text-color="white"
                icon="eva-lock-outline"
              >
                {{ $t("common.privateOffice") }}
              </q-chip>
            </template>
          </div>
        </div>

        <div class="q-my-md">
          <template v-if="space.internet">
            <q-icon size="sm" name="eva-wifi-outline" />
            {{ space.internet_speed }}
          </template>
          <template v-else>
            <q-icon size="sm" name="eva-wifi-off-outline" />
          </template>
        </div>
        <div class="q-mt-sm">
          <q-icon size="sm" name="eva-clock-outline" />
          {{ $t("common.opensAt") }} {{ parseTime(space.opens_at) }} -
          {{ $t("common.closesAt") }} {{ parseTime(space.closes_at) }}
        </div>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <p class="text-h5">{{ $t("common.location") }}</p>
        <div class="text-grey text-italic q-my-md">
          {{ space.country }} - {{ space.city }}
        </div>
        <div style="height: 425px; position: relative">
          <viewLocation :coordinates="space.location" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import supabase from "boot/supabase";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Notify } from "quasar";
import { parseTime } from "src/utils/time";
import spaceTypes from "src/utils/spaceTypes";
import ViewLocation from "components/Map/ViewLocation.vue";

export default {
  name: "PageCompleteSpaceDetails",
  components: { ViewLocation },
  setup() {
    const loading = ref(true);
    const space = ref({
      photos: [],
      type: "work_office",
    });
    const spaceId = useRoute().params.spaceId;
    const spaceType = ref(null);

    supabase
      .from("spaces")
      .select("*, photos(url)")
      .eq("id", spaceId)
      .then(({ error, data }) => {
        if (data) {
          space.value = data[0];
          spaceType.value = spaceTypes.find(
            (type) => type.value === space.value.type
          );
        } else {
          Notify.create({
            color: "negative",
            message: error.message,
          });
        }
        loading.value = false;
      });

    return {
      space,
      asssetsRoute:
        process.env.SUPABASE_PROJECT_URL + "/storage/v1/object/public/",
      slide: ref(1),
      parseTime,
      spaceType,
    };
  },
};
</script>
