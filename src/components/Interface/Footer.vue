<template>
  <div class="constrain-width">
    <div class="footer-container q-mx-md q-my-md">
      <q-img
        src="logotipo_vector.png"
        spinner-color="white"
        style="width: 80px"
        @click="$router.push('/')"
        class="q-mr-sm cursor-pointer"
      />
      <q-separator class="q-my-md" />
      <div class="footer-links">
        <span :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'">
          Copyright © {{ getYear() }} Cowofi
        </span>
        <span
          :class="`link ${$q.dark.isActive ? 'text-white' : 'text-grey-7'}`"
          @click="$router.push('/legal/terms-and-conditions')"
        >
          {{ $t("common.termsAndConditions") }}
        </span>
        <span
          :class="`link ${$q.dark.isActive ? 'text-white' : 'text-grey-7'}`"
          @click="$router.push('/legal/privacy-policy')"
        >
          {{ $t("common.privacyPolicy") }}
        </span>
        <span
          :class="`link ${$q.dark.isActive ? 'text-white' : 'text-grey-7'}`"
          @click="goToGithub"
        >
          {{ $t("common.about") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentFooter",
  setup() {
    return {
      getYear() {
        return new Date().getFullYear();
      },
      goToGithub() {
        location.href = "https://github.com/cowofi";
      },
    };
  },
};
</script>
<style scoped>
.footer-links .link {
  margin: 0 0.5rem;
  cursor: pointer;
}
.footer-links .link:hover {
  text-decoration: underline;
}
.footer-links .link:before {
  content: "|";
  margin: 0 0.5rem;
}
</style>
