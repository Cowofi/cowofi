<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title> Logo here </q-toolbar-title>
        <q-btn
          v-for="link in essentialLinks"
          :key="link.title"
          stretch
          flat
          :label="link.title"
          :to="link.route"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const leftDrawerOpen = ref(false);
    const $t = useI18n().t;

    const linksList = [
      {
        title: $t("common.home"),
        route: "/",
      },
      {
        title: $t("common.explorer"),
        route: "/explorer",
      },
    ];

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
