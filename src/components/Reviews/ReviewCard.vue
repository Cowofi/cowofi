<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12">
      <div class="row justify-center items-center">
        <div class="col-4">
          <q-avatar color="primary" text-color="white">
            {{ review.users.raw_user_meta_data.full_name.substring(0, 1) }}
          </q-avatar>
          <span class="q-ml-sm">
            {{ review.users.raw_user_meta_data.full_name }}
          </span>
        </div>
        <div class="col text-right text-grey-8">
          {{ timeAgo(review.created_at) }}
        </div>
      </div>
    </div>
    <div class="col-12">
      <q-rating
        v-model="rating"
        size="1.5em"
        color="yellow-8"
        icon="eva-star-outline"
        icon-selected="eva-star"
        readonly
      />
    </div>
    <div class="col-12">
      <q-separator />
    </div>
    <div class="col-12">
      <p>{{ review.comment }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { timeAgo } from "src/utils/time";

export default {
  name: "ComponentReviewCard",
  props: {
    review: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const rating = ref(props.review.rating);
    return {
      rating,
      timeAgo,
    };
  },
};
</script>
