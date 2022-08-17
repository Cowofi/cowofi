<template>
  <q-layout view="lhH Lpr lFf">
    <q-header>
      <q-toolbar class="bg-white">
        <q-toolbar-title>
          <q-img
            src="/images/illustrations/cowofi_isotipo.svg"
            alt="Logotipo"
            spinner-color="white"
            style="height: 10%; width: 6%"
            class="q-ma-xs cursor-pointer"
            @click="$router.push('/')"
          />
          <q-img
            src="/images/illustrations/logotipo.png"
            alt="Logotipo"
            spinner-color="white"
            style="height: 20%; width: 15%"
            class="q-ma-xs cursor-pointer"
            @click="$router.push('/')"
          />
        </q-toolbar-title>
        <q-btn
          v-for="link in essentialLinks"
          :key="link.title"
          stretch
          flat
          text-color="secondary"
          :label="link.title"
          :to="link.route"
        />
        <template v-if="authStore.user.id">
          <q-avatar class="cursor-pointer" color="primary" text-color="white">
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
            push
            to="/auth/login"
            color="primary"
            text-color="white"
            class="q-ml-md"
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

<style scoped></style>
