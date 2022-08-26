<template>
  <q-card class="type-card-container">
    <q-card-section>
      <div class="row justify-center items-center">
        <div class="col-xs-12 col-md-4">
          <slot name="img"></slot>
        </div>
        <div class="col-xs-12 col-md-8">
          <span class="text-bold">{{ title }}</span>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="left">
      <q-btn
        :to="to"
        flat
        :text-color="$q.dark.isActive ? 'white' : 'black'"
        icon="eva-arrow-circle-right-outline"
        :label="$t('action.viewMore')"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: "ComponentSpaceType",
  props: {
    title: {
      type: String,
      default: "",
    },
    to: {
      type: String,
      default: "#",
    },
  },
  setup() {
    return {};
  },
};
</script>
<style>
.type-card-container {
  max-width: 250px;
  height: 100%;
}
</style>
