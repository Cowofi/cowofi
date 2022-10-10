<template>
  <q-btn
    push
    color="primary"
    label="share"
    icon="eva-share-outline"
    :onclick="handleShowModal"
    style="position: absolute; z-index: 999; left: 85%; top: 5%"
  >
    <q-dialog v-model="showModal" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Share on</div>
        </q-card-section>

        <q-card-section class="q-pt-none flex flex-center" style="gap: 10px">
          <ShareNetwork
            network="facebook"
            :url="url"
            :description="getTitle"
            title="CoWoFi - Find your space much easier"
            hashtags="CoWoFi,cowofi,spaces,working"
            style="text-decoration: none"
          >
            <q-btn push icon="eva-facebook" color="blue-14" round />
          </ShareNetwork>

          <ShareNetwork
            network="twitter"
            :url="url"
            :title="getTitle"
            hashtags="CoWoFi,cowofi,spaces,working"
            style="text-decoration: none"
          >
            <q-btn push icon="eva-twitter" color="blue-5" round />
          </ShareNetwork>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn push flat label="Close" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ShareButton",
  props: ["placeToShare"],
  data() {
    return {
      showModal: false,
      title: this.$props.placeToShare.space.description,
      url:
        "https://cowofi.netlify.app/spaces/view/" + this.$route.params.spaceId,
    };
  },
  methods: {
    handleShowModal() {
      this.$data.showModal = true;
    },
    closeModal() {
      this.$data.showModal = false;
    },
  },
  computed: {
    getTitle() {
      return this.$data.title;
    },
  },
});
</script>
