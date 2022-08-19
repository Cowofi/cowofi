<template>
  <q-page>
    <div class="row justify-center">
      <div class="row justify-center items-center">
        <div class="col-6 text-left">
          <img
            alt="work time illustration"
            src="/images/illustrations/not_found.png"
            :style="{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: -5,
              position: 'relative',
            }"
          />
        </div>
        <div class="col-sm-6 col-xs-12">
          <q-chip color="secondary" text-color="white"> Page not found </q-chip>
          <p class="text-h2 text-bold text-left">
            {{ $t("messages.information.thereIsNoSpace") }}
          </p>
          <div class="col-12 text-left">
            <q-btn
              push
              color="primary"
              text-color="white"
              rounded
              :label="$t('action.goBack')"
              icon="eva-search-outline"
              to="/explorer"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "NotFound",
  setup() {
    return {};
  },
});
</script>
