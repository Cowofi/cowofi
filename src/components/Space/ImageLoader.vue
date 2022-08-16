<template>
  <div>
    <div
      class="text-center cursor-pointer q-pa-md"
      @click="$refs.fileInput.click()"
      style="border: 2px dashed grey"
    >
      <q-icon name="eva-upload-outline" size="lg" />
      <p>
        {{ $t("messages.information.clickHereToUploadMultipleImages") }}
      </p>
    </div>
    <input
      style="display: none"
      ref="fileInput"
      type="file"
      name="photo"
      accept="image/jpeg, image/png"
      multiple
      @change="setPhotoFiles($event.target.name, $event.target.files)"
    />
    <div class="row q-col-gutter-sm q-mt-md">
      <div
        class="col"
        style="position: relative"
        v-for="(photoFile, index) in convertedPhotoFiles"
        :key="index"
      >
        <q-btn
          @click="removePhotoFile(index)"
          style="position: absolute; left: 0; top: 0"
          color="white"
          text-color="black"
          icon="eva-close-outline"
          size="sm"
          round
        />
        <img
          :src="photoFile"
          style="max-width: 150px; border: 1px solid grey"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { v4 } from "uuid";

export default {
  name: "ComponentImageLoader",
  props: {
    inputPhotos: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const convertedPhotoFiles = ref([]);
    const originalPhotoFiles = ref([]);
    const getImageExtension = (fileName) => {
      return fileName.split(".").pop();
    };

    watch(
      () => props.inputPhotos,
      (currentValue, oldValue) => {
        originalPhotoFiles.value = currentValue.map((photo) => ({
          url: photo.url,
          id: photo.id,
          name: photo.url.split("/").pop(),
        }));
        convertedPhotoFiles.value = currentValue.map((photo) => photo.url);
      }
    );

    return {
      convertedPhotoFiles,
      setPhotoFiles(_, fileList) {
        const files = Array.from(fileList);

        files.forEach((element) => {
          originalPhotoFiles.value.push({
            name: `${v4()}.${getImageExtension(element.name)}`,
            file: element,
          });
          convertedPhotoFiles.value.push(URL.createObjectURL(element));
        });

        emit("files", originalPhotoFiles.value);
      },
      removePhotoFile(index) {
        convertedPhotoFiles.value.splice(index, 1);
        originalPhotoFiles.value.splice(index, 1);
      },
    };
  },
};
</script>
