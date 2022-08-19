<template>
  <div class="row q-col-gutter-md items-center">
    <div class="col-2">
      <q-avatar>
        <img
          v-if="space.photos[0]"
          :src="asssetsRoute + space.photos[0].url"
          :style="{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
          }"
        />
      </q-avatar>
    </div>
    <div class="col-10">
      <div class="ellipsis">
        {{ space.description }}
      </div>
      <q-btn
        :to="`/spaces/view/${space.id}`"
        flat
        color="primary"
        dense
        :label="$t('action.goToSpace')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentSpaceMinimal",
  props: {
    space: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      asssetsRoute:
        process.env.SUPABASE_PROJECT_URL + "/storage/v1/object/public/",
    };
  },
};
</script>
