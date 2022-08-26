<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <MobileMenu v-if="$q.screen.xs" />
      <DesktopMenu v-else />
    </q-header>
    <q-page-container>
      <router-view />
      <footer-component />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import footerComponent from "components/Interface/Footer.vue";
import DesktopMenu from "src/components/Interface/DesktopMenu.vue";
import MobileMenu from "src/components/Interface/MobileMenu.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    footerComponent,
    DesktopMenu,
    MobileMenu,
  },
  setup() {
    return {};
  },
});
</script>
