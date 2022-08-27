<template>
  <q-page padding>
    <q-card flat style="max-width: 300px" class="q-mx-auto q-mt-lg">
      <q-card-section class="text-center">
        <q-img src="/logotipo.png" spinner-color="white" />
      </q-card-section>
      <q-card-section v-if="success">
        <div class="row text-center">
          <div class="col-12">
            <q-icon name="eva-email-outline" size="100px" color="primary" />
          </div>
          <div class="col-12">
            <p>
              {{ $t("messages.information.passwordRecoverySuccessMessage") }}
              <span class="text-bold q-mx-xs">{{ email }}</span>
              {{ $t("messages.information.passwordRecoverySuccessMessage2") }}
            </p>
          </div>
          <div class="col-12">
            <q-btn to="/" color="primary" :label="$t('action.goHome')" />
          </div>
        </div>
      </q-card-section>
      <q-card-section v-else>
        <q-form @submit="submit()" class="q-gutter-md">
          <p>
            {{ $t("messages.information.passwordRecoveryDescription") }}
          </p>
          <q-input
            type="email"
            outlined
            v-model="email"
            :label="$t('common.email')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <div class="text-center">
            <q-btn
              push
              :loading="loading"
              :label="$t('action.continue')"
              type="submit"
              color="primary"
              text-color="white"
              icon="eva-log-in-outline"
            />
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
import { useRouter } from "vue-router";

export default {
  name: "PageForgotPasswor",
  setup() {
    const email = ref("");
    const loading = ref(false);
    const success = ref(false);

    const submit = async () => {
      loading.value = true;
      supabase.auth.api.resetPasswordForEmail(email.value).then(({ error }) => {
        if (error) {
          loading.value = false;

          Notify.create({
            color: "negative",
            message: error.message,
          });
          return;
        }

        success.value = true;
      });
    };
    return {
      email,
      loading,
      submit,
      success,
    };
  },
};
</script>
