<template>
  <q-card
    :class="`type-card-container cursor-pointer text-center ${
      isSelected ? 'selected' : ''
    }`"
  >
    <q-card-section>
      <div class="row justify-center items-center">
        <div class="col-xs-12 col-sm-4 image-container">
          <slot name="img"></slot>
        </div>
        <div class="col-xs-12 col-sm-8">
          <span class="text-bold">{{ title }}</span>
        </div>
        <div class="col-12">
          <slot name="selection"></slot>
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
    isSelected: {
      type: Boolean,
      default: false,
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
  height: 110px;
}
.image-container img {
  height: 40px;
  border-radius: 4px;
}
/* Media query max width 600px */
@media (max-width: 600px) {
  .type-card-container {
    height: auto;
  }
}

.type-card-container.selected {
  border: 1px solid var(--q-primary) !important;
}
</style>
