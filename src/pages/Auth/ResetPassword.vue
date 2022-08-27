<template>
  <q-page padding>
    <q-card flat style="max-width: 400px" class="q-mx-auto q-mt-lg">
      <q-card-section class="text-center">
        <q-img width="250px" src="/logotipo.png" spinner-color="white" />
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit">
          <div class="row">
            <div class="col-12">
              <q-input
                type="password"
                outlined
                v-model="password"
                :label="$t('common.password')"
                lazy-rules
                :rules="[
                  (val) =>
                    isPasswordSecure(val) ||
                    this.$t('messages.error.passwordSecurityDescription'),
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
                    this.$t('messages.error.passwordSecurityDescription'),
                ]"
              />
            </div>
            <div class="col-12">
              <p class="text-bold">
                {{ $t("messages.information.passwordMustContain") }}:
              </p>
              <ul>
                <li>
                  {{ $t("messages.information.atLeast8Characters") }}
                  <q-icon
                    v-show="have8Characters(password)"
                    name="eva-checkmark-outline"
                    color="positive"
                  />
                </li>
                <li>
                  {{ $t("messages.information.atLeast1Uppercase") }}
                  <q-icon
                    v-show="hasUppercase(password)"
                    name="eva-checkmark-outline"
                    color="positive"
                  />
                </li>
                <li>
                  {{ $t("messages.information.atLeast1Number") }}
                  <q-icon
                    v-show="have1Number(password)"
                    name="eva-checkmark-outline"
                    color="positive"
                  />
                </li>
              </ul>
            </div>
            <div class="col-12 text-center q-my-md">
              <q-btn
                :disable="
                  password !== confirmPassword || !password || !confirmPassword
                "
                push
                :loading="loading"
                :label="$t('action.changePassword')"
                type="submit"
                color="primary"
                text-color="white"
                icon="eva-paper-plane-outline"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { Notify } from "quasar";
import supabase from "boot/supabase";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export default {
  name: "PageResetPassword",
  setup() {
    const password = ref(null);
    const confirmPassword = ref(null);
    const loading = ref(false);
    const { params } = useRoute();
    const { access_token } = params;
    const router = useRouter();
    const $t = useI18n().t;

    return {
      password,
      confirmPassword,
      loading,
      isPasswordSecure(password) {
        if (password) {
          const regex = /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/;
          return regex.test(password);
        }
        // Prevent show error message on empty field
        return true;
      },
      hasUppercase(password) {
        if (password) {
          const regex = /[A-Z]/;
          return regex.test(password);
        }
      },
      have8Characters(password) {
        if (password) {
          return password.length >= 8;
        }
      },
      have1Number(password) {
        if (password) {
          const regex = /[0-9]/;
          return regex.test(password);
        }
      },
      async onSubmit() {
        loading.value = true;
        const { error, data } = await supabase.auth.api.updateUser(
          access_token,
          {
            password: password,
          }
        );

        if (error) {
          Notify.create({
            color: "negative",
            textColor: "white",
            message: error.message,
          });
          loading.value = false;
        } else {
          Notify.create({
            color: "positive",
            textColor: "white",
            message: $t("messages.information.passwordChangedSuccessfully"),
          });
          router.push("/auth/login");
        }
      },
    };
  },
};
</script>
