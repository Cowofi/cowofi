<template>
  <router-view class="constrain-width" />
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent } from "vue";
import { useAuthStore } from "stores/Auth";
import supabase from "boot/supabase";

export default defineComponent({
  name: "App",
  setup() {
    const $q = useQuasar();
    $q.dark.set(true);

    const user = supabase.auth.user();

    if (user) {
      const authStore = useAuthStore();
      authStore.setUser(user);
    }
  },
});
</script>
