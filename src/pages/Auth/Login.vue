<template>
  <q-page padding>
    <q-card flat style="max-width: 300px" class="q-mx-auto q-mt-lg">
      <q-card-section class="text-center">
        <q-img
          src="/images/main-logo.png"
          spinner-color="white"
          style="height: 100px; max-width: 100px"
        />
        <div class="text-bold">Cowofi</div>
      </q-card-section>

      <q-form @submit="loginWithEmailAndPassword()" class="q-gutter-md">
        <q-input
          type="email"
          outlined
          v-model="email"
          :label="$t('common.email')"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          type="password"
          outlined
          v-model="password"
          :label="$t('common.password')"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <div class="text-right q-my-none">
          <q-btn
            to="/auth/forgot-password"
            class="q-my-none"
            dense
            flat
            color="primary"
            text-color="black"
            :label="$t('common.forgotPassword')"
          />
        </div>
        <div class="text-center">
          <q-btn
            push
            :loading="loading"
            :label="$t('common.login')"
            type="submit"
            color="primary"
            text-color="black"
            icon="eva-log-in-outline"
          />
        </div>
        <div class="text-center">
          <q-btn
            flat
            to="/auth/register"
            :label="$t('common.registerWithEmail')"
            color="primary"
            icon="eva-person-add-outline"
            text-color="black"
          />
        </div>
        <div class="text-center">
          <q-separator class="q-my-md" />
          <span class="text-grey-7">
            {{ $t("common.connectWithOneClick") }}
          </span>
        </div>
      </q-form>

      <q-btn
        push
        class="full-width q-mt-md"
        color="#FFFFFF"
        @click="dispatchGoogleAuth()"
      >
        <q-img
          style="margin-right: 24px"
          width="18px"
          src="https://developers.google.com/static/identity/images/g-logo.png"
        />
        <span style="color: #777777">Google</span>
      </q-btn>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { Notify } from "quasar";
import supabase from "boot/supabase";
import { useAuthStore } from "stores/Auth";
import { useRouter } from "vue-router";

export default {
  name: "PageLogin",
  setup() {
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const $router = useRouter();

    return {
      email,
      password,
      loading,
      async loginWithEmailAndPassword() {
        loading.value = true;
        const { user, error } = await supabase.auth.signIn({
          email: email.value,
          password: password.value,
        });

        loading.value = false;
        if (!error) {
          const authStore = useAuthStore();
          authStore.setUser(user);
          $router.push("/");
        } else {
          Notify.create({
            type: "negative",
            message: error.message,
            position: "top",
            icon: "eva-alert-circle-outline",
          });
        }
      },
      async dispatchGoogleAuth() {
        const { user, session, error } = await supabase.auth.signIn({
          provider: "google",
        });
      },
    };
  },
};
</script>
