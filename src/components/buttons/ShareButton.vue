<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn
      color="primary"
      label="shared"
      icon="eva-share-outline"
      class="flex justify-end"
      :onclick="handleShowModal"
    />

    <q-dialog v-model="showModal" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Share on</div>
        </q-card-section>

        <q-card-section class="q-pt-none flex flex-center" style="gap: 10px">
          <q-btn
            icon="eva-facebook"
            color="blue-14"
            round
            @click="handleFacebookShared"
          />
          <q-btn icon="eva-twitter" color="blue-5" round />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="Close" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { shareOnFacebook } from "../../utils/socialMedia";

export default defineComponent({
  name: "ShareButton",
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    handleShowModal() {
      this.$data.showModal = true;
    },
    closeModal() {
      this.$data.showModal = false;
    },
    handleFacebookShared() {
      shareOnFacebook();
    },
  },
});
</script>
