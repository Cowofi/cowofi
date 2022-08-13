<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-secondary">
        <q-toolbar-title> Logo here </q-toolbar-title>
        <q-btn
          v-for="link in essentialLinks"
          :key="link.title"
          stretch
          flat
          :label="link.title"
          :to="link.route"
        />
        <template v-if="authStore.user.id">
          <q-avatar class="cursor-pointer" color="warning" text-color="white">
            {{ authStore.user.user_metadata.full_name.substring(0, 1) }}
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="logout()">{{
                    $t("common.logout")
                  }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-avatar>
        </template>
        <template v-else>
          <q-btn
            to="/auth/login"
            color="warning"
            text-color="black"
            :label="$t('common.joinNow')"
          />
        </template>
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
import { useAuthStore } from "stores/Auth";
import supabase from "boot/supabase";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const $t = useI18n().t;
    const authStore = useAuthStore();
    const loading = ref(false);

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
      authStore,
      essentialLinks: linksList,
      loading,
      async logout() {
        loading.value = true;
        await supabase.auth.signOut();
        authStore.logout();
        loading.value = false;
      },
    };
  },
});
</script>
