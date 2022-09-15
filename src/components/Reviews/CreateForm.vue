<template>
  <div class="row">
    <div class="col-12">
      <p>{{ $t("messages.information.howDidweDo") }}</p>
      <div class="text-center">
        <q-rating
          v-model="rating"
          size="3.5em"
          color="yellow-8"
          icon="eva-star-outline"
          icon-selected="eva-star"
        />
      </div>
    </div>
    <div class="col-12">
      <p>{{ $t("messages.information.careShareMoreAboutIt") }}</p>
      <q-input
        v-model="comment"
        outlined
        :label="$t('common.comment')"
        type="textarea"
        :counter="true"
        :maxlength="100"
      />
    </div>
    <div class="col-12 text-center">
      <q-btn
        :disabled="rating === 0"
        :loading="loading"
        @click="submit"
        push
        color="primary"
        text-color="white"
        :label="$t('action.publishFeedback')"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ComponentReviewForm",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const rating = ref(0);
    const comment = ref("");

    return {
      rating,
      comment,
      submit() {
        emit("on-created", {
          rating: rating.value,
          comment: comment.value,
        });
      },
    };
  },
};
</script>
