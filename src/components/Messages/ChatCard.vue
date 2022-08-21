<template>
  <div
    @click="$emit('selected')"
    :class="`chat-card-container row q-col-gutter-md items-center cursor-pointer ${
      isSelected ? 'selected' : ''
    }`"
  >
    <div class="col-md-4">
      <q-avatar size="md" color="primary" text-color="white">
        {{ chat.to_user_name.substring(0, 1) }}
      </q-avatar>
    </div>
    <div class="col-md-8">{{ chat.to_user_name }}</div>
  </div>
</template>

<script>
export default {
  name: "ComponentChat",
  props: {
    chat: {
      type: Object,
      required: true,
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
.chat-card-container.selected {
  font-weight: bold;
}
</style>
