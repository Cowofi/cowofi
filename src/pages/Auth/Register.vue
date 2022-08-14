<template>
  <q-page padding>
    <template v-if="success">
      <h3>Verify your email address</h3>
      <p>
        We have sent you an email with a verification link. Please click the
        link to verify your email address.
      </p>
      <q-btn
        color="primary"
        push
        text-color="black"
        to="/"
        label="Back to home"
      />
    </template>
    <template v-else>
      <q-card flat style="max-width: 400px" class="q-mx-auto q-mt-lg">
        <q-card-section class="text-center">
          <q-img
            src="~assets/main-logo.png"
            spinner-color="white"
            style="height: 100px; max-width: 100px"
          />
          <div class="text-bold">Cowofi</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              type="text"
              outlined
              v-model="fullname"
              :label="$t('common.fullname')"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 5) || 'Please type something',
              ]"
            />
            <q-input
              type="text"
              outlined
              v-model="email"
              :label="$t('common.email')"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />
            <q-input
              type="password"
              outlined
              v-model="password"
              :label="$t('common.password')"
              lazy-rules
              :rules="[
                (val) =>
                  isPasswordSecure(val) ||
                  this.$t('messages.errors.passwordSecurity'),
              ]"
            />
            <q-input
              type="password"
              outlined
              v-model="confirmPassword"
              :label="$t('common.confirmPassword')"
              lazy-rules
              :rules="[
                (val) =>
                  isPasswordSecure(val) ||
                  this.$t('messages.errors.passwordSecurity'),
              ]"
            />
            <div class="text-center">
              <q-btn
                :disable="password !== confirmPassword"
                push
                :loading="loading"
                :label="$t('common.register')"
                type="submit"
                color="primary"
                text-color="black"
                icon="eva-person-add-outline"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script>
import { Notify } from "quasar";
import { ref } from "vue";
import supabase from "boot/supabase";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/Auth";

export default {
  name: "PageRegister",
  setup() {
    const $router = useRouter();
    const fullname = ref("");
    const email = ref(null);
    const password = ref(null);
    const confirmPassword = ref(null);
    const loading = ref(false);
    const success = ref(false);

    return {
      fullname,
      email,
      password,
      confirmPassword,
      loading,
      success,
      isPasswordSecure(password) {
        if (password) {
          const regex = /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/;
          return regex.test(password);
        }
        // Prevent show error message on empty field
        return true;
      },
      async onSubmit() {
        loading.value = true;
        const { user, session, error } = await supabase.auth.signUp(
          {
            email: email.value,
            password: password.value,
          },
          {
            data: {
              full_name: fullname.value,
            },
          }
        );

        if (!error) {
          success.value = true;
        } else {
          Notify.create({
            type: "negative",
            message: error.message,
            position: "top",
            icon: "eva-alert-circle-outline",
          });
        }
      },
    };
  },
};
</script>
