<template>
  <q-page padding>
    <q-btn
      push
      class="full-width q-mt-md"
      color="#FFFFFF"
      @click="dispatchGoogleAuth()"
      :disable="loading"
    >
      <q-img
        style="margin-right: 24px"
        width="18px"
        src="https://developers.google.com/static/identity/images/g-logo.png"
      />
      <span style="color: #777777">Google</span>
    </q-btn>
  </q-page>
</template>

<script>
import supabase from "boot/supabase";

export default {
  name: "PageLogin",
  setup() {
    console.log(supabase.auth.user());
    return {
      async dispatchGoogleAuth() {
        const { user, session, error } = await supabase.auth.signIn({
          provider: "google",
        });
      },
    };
  },
};
</script>
