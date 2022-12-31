<template>
  <q-toolbar
    :class="`${
      $q.dark.isActive ? 'bg-dark text-white' : 'bg-white'
    } constrain-width`"
  >
    <q-btn
      v-for="link in essentialLinks"
      :key="link.title"
      stretch
      flat
      :class="activeIcon(link.route)"
      :text-color="$q.dark.isActive ? 'white' : 'secondary'"
      :icon="link.icon"
      :to="link.route"
    />
    <template v-if="authStore.user.id">
      <q-btn
        stretch
        flat
        to="/messages"
        :text-color="$q.dark.isActive ? 'white' : 'secondary'"
        icon="eva-message-circle-outline"
        :class="activeIcon('/messages')"
      />
      <q-space />
      <q-avatar class="cursor-pointer" color="primary" text-color="white">
        {{ authStore.user.user_metadata.full_name.substring(0, 1) }}
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section @click="$router.push('/profile')">{{
                $t("common.profile")
              }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="logout()">{{
                $t("common.logout")
              }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-avatar>
      <NotificationsPanelVue />
    </template>
    <template v-else>
      <q-space />
      <q-btn
        push
        to="/auth/login"
        color="primary"
        text-color="white"
        class="q-ml-md"
        :label="$t('common.joinNow')"
      />
    </template>
    <q-toggle
      color="primary"
      dark
      v-model="darkMode"
      :icon="darkMode ? 'eva-moon-outline' : 'eva-sun-outline'"
      @update:model-value="toggleDarkMode"
    />
  </q-toolbar>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "stores/Auth";
import supabase from "boot/supabase";
import { useRouter } from "vue-router";
import NotificationsPanelVue from 'components/Interface/NotificationsPanel.vue';

export default {
  name: "ComponentMobileMenu",
  components: {
    NotificationsPanelVue,
  },
  setup() {
    const darkmodeFromLocalStorage = localStorage.getItem("darkmode");
    const $q = useQuasar();

    const $t = useI18n().t;
    const authStore = useAuthStore();
    const loading = ref(false);
    const $router = useRouter();
    const darkMode = ref(darkmodeFromLocalStorage || $q.dark.isActive);
    const linksList = [
      {
        icon: "eva-home-outline",
        route: "/",
      },
      {
        icon: "eva-search-outline",
        route: "/explorer",
      },
    ];
    return {
      essentialLinks: linksList,
      authStore,
      loading,
      darkMode,
      async logout() {
        loading.value = true;
        await supabase.auth.signOut();
        authStore.logout();
        loading.value = false;
        $router.push("/");
      },
      toggleDarkMode() {
        window.localStorage.setItem("darkMode", darkMode.value);
        $q.dark.set(darkMode.value);
      },
      activeIcon(route) {
        return $router.currentRoute.value.path === route ? "active" : null;
      },
    };
  },
};
</script>
<style>
.active {
  color: var(--q-primary) !important;
}
</style>
