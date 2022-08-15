<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row q-col-gutter-md space-mini-container">
        <div class="col-4">
          <img
            v-if="space.photos[0]"
            :src="asssetsRoute + space.photos[0].url"
            alt=""
          />
        </div>
        <div class="col-8">
          <div class="row">
            <div class="col-12">
              <p class="elipsis-2">
                {{ space.description }}
              </p>
            </div>
            <div class="col-12">
              <space-type-selection :title="spaceType.title">
                <template v-slot:img>
                  <img width="50" :src="spaceType.img" />
                </template>
              </space-type-selection>

              {{ space.internet }} {{ space.internet_speed }}
            </div>
            <div class="col-12 text-right text-bold">${{ space.price }}</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import spaceTypes from "src/utils/spaceTypes";
import SpaceTypeSelection from "components/Space/TypeSelectionCard.vue";

export default {
  name: "ComponentSpaceMini",
  props: {
    space: {
      type: Object,
      required: true,
    },
  },
  components: {
    SpaceTypeSelection,
  },
  setup(props) {
    const spaceType = spaceTypes.find(
      (type) => type.value === props.space.type
    );
    return {
      spaceType,
      asssetsRoute:
        process.env.SUPABASE_PROJECT_URL + "/storage/v1/object/public/",
    };
  },
};
</script>
<style>
.space-mini-container img {
  max-width: 200px;
  border-radius: 4px;
}
</style>
