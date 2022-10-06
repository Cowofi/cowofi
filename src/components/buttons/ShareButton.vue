<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn
      color="primary"
      label="shared"
      icon="eva-share-outline"
      class="flex justify-end"
      :onclick="handleClick"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ShareButton",
  methods: {
    handleClick() {
      console.log("Click");
    },
  },
});
</script>
