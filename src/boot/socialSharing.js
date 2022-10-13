// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file

import VueSocialSharing from "vue-social-sharing";
export default ({ app }) => {
  app.use(VueSocialSharing);
};
