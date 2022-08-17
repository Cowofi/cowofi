<template>
  <q-card class="type-card-container">
    <q-card-section>
      <div class="row justify-center items-center">
        <div class="col-4">
          <slot name="img"></slot>
        </div>
        <div class="col-8">
          <span class="text-bold">{{ title }}</span>
        </div>
        <div class="col-12">
          <q-btn
            :to="to"
            flat
            :label="$t('action.viewMore')"
            text-color="black"
            icon-right="eva-arrow-circle-right-outline"
          />
        </div>
      </div>
    </q-card-section>
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
  height: 120px;
}
</style>
