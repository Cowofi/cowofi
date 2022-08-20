<template>
  <q-card
    @click="$router.push(`/spaces/view/${space.id}`)"
    class="cursor-pointer"
    flat
    bordered
    style="max-width: 650px; position: relative"
  >
    <q-chip
      v-if="space.new"
      style="position: absolute; float: left; z-index: 2; margin: 0"
      color="red"
      text-color="white"
      icon="eva-flash-outline"
      :label="$t('common.new')"
    />
    <q-card-section>
      <div class="row q-col-gutter-md space-mini-container">
        <div class="col-xs-12 col-sm-4">
          <img
            v-if="space.photos[0]"
            :src="asssetsRoute + space.photos[0].url"
            :style="{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }"
          />
        </div>
        <div class="col-xs-12 col-sm-8">
          <div class="row">
            <div class="col-12">
              <p class="ellipsis-2-lines">
                {{ space.description }}
              </p>
            </div>
            <div class="col-12">
              <div class="row items-center">
                <div class="col-2">
                  <img width="50" :src="spaceType.img" />
                </div>
                <div class="col-10">
                  {{ spaceType.title }}
                  <template v-if="space.private_office">
                    -
                    <span class="text-primary">
                      {{ $t("common.privateOffice") }}</span
                    >
                  </template>
                </div>
              </div>

              <div class="text-grey text-italic">
                {{ space.country }} - {{ space.city }}
              </div>

              <div class="q-mt-sm">
                <q-icon size="sm" name="eva-clock-outline" />

                {{ $t("common.opensAt") }} {{ parseTime(space.opens_at) }} -
                {{ $t("common.closesAt") }} {{ parseTime(space.closes_at) }}
              </div>
              <div>
                <q-chip
                  v-for="day in space.available_week_days"
                  :key="day"
                  color="primary"
                  text-color="white"
                  size="sm"
                >
                  {{ getWeekDayLabel(day) }}
                </q-chip>
              </div>

              <q-separator class="q-my-md" />
              <template v-if="space.internet">
                <q-icon size="sm" name="eva-wifi-outline" />
                {{ space.internet_speed }}
              </template>
              <template v-else>
                <q-icon size="sm" name="eva-wifi-off-outline" />
              </template>
              <div class="float-right text-bold">${{ space.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import spaceTypes from "src/utils/spaceTypes";
import { parseTime, weekdays } from "src/utils/time";

export default {
  name: "ComponentSpaceMini",
  props: {
    space: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const spaceType = spaceTypes.find(
      (type) => type.value === props.space.type
    );

    return {
      spaceType,
      asssetsRoute:
        process.env.SUPABASE_PROJECT_URL + "/storage/v1/object/public/",
      parseTime,
      getWeekDayLabel(day) {
        return weekdays.find((d) => d.value === day).label;
      },
    };
  },
};
</script>
<style>
.space-mini-container {
  height: 246px;
}
.space-mini-container img {
  max-width: 200px;
  border-radius: 4px;
}
</style>
