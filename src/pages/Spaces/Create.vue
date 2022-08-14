<template>
  <q-page padding>
    <q-form class="q-gutter-md">
      <q-card flat bordered>
        <q-card-section style="height: 200px"> images import </q-card-section>
      </q-card>
      <q-card class="q-mt-md" flat bordered>
        <q-card-section class="q-gutter-md">
          <p>{{ $t("common.basicInformation") }}</p>
          <q-input
            :label="$t('common.description')"
            v-model="space.description"
            outlined
            type="textarea"
          />
          <q-input
            :label="$t('common.phone')"
            v-model="space.phone"
            outlined
            mask="(###) ### - ####"
          />
          <div class="q-my-md">
            <div class="row q-col-gutter-sm">
              <div
                class="col-3"
                v-for="spaceType in spaceTypes"
                :key="spaceType.value"
              >
                <space-type-selection
                  :title="spaceType.title"
                  @click="space.type = spaceType.value"
                >
                  <template v-slot:img>
                    <img width="50" :src="spaceType.img" />
                  </template>
                  <template v-slot:selection>
                    <q-radio
                      v-model="space.type"
                      :val="spaceType.value"
                      :label="spaceType.title"
                    />
                  </template>
                </space-type-selection>
              </div>
            </div>
          </div>
          <q-toggle v-model="space.internet" label="Internet" />
          <q-input
            outlined
            v-model="space.internetSpeed"
            :label="$t('common.internetSpeed')"
          />
          <q-toggle
            v-model="space.privateOffice"
            :label="$t('common.privateOffice')"
          />
        </q-card-section>
      </q-card>
      <q-card class="q-mt-md" flat bordered>
        <q-card-section class="q-gutter-md">
          <p>{{ $t("common.location") }}</p>
          <q-select
            outlined
            v-model="space.country"
            :options="[]"
            :label="$t('common.country')"
            style="width: 250px"
            dropdown-icon="eva-arrow-down-outline"
          />
          <q-select
            outlined
            v-model="space.city"
            :options="[]"
            :label="$t('common.city')"
            style="width: 250px"
            dropdown-icon="eva-arrow-down-outline"
          />
          <div style="height: 200px; border: 1px solid grey">Map here</div>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <q-btn
              class="full-width"
              color="primary"
              text-color="black"
              :label="$t('action.publish')"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script>
import { ref } from "vue";
import SpaceTypeSelection from "components/Space/TypeSelectionCard.vue";

export default {
  name: "PageCreateSpace",
  components: {
    SpaceTypeSelection,
  },
  setup() {
    const space = ref({
      description: "",
      internet: true,
      internetSpeed: "",
      opensAt: "",
      closesAt: "",
      price: 0,
      country: "",
      city: "",
      location: "",
      phone: "",
      type: "work_space",
      privateOffice: false,
    });

    return {
      space,
      spaceTypes: [
        {
          img: "/images/illustrations/co-working.png",
          title: "Work Space",
          value: "work_space",
        },
        {
          img: "/images/illustrations/chill_zone.png",
          title: "Chill Zone",
          value: "chill_zone",
        },
        {
          img: "/images/illustrations/coffee.png",
          title: "Coffee Shop",
          value: "coffee_shop",
        },
        {
          img: "/images/illustrations/eating.png",
          title: "Restaurant",
          value: "restaurant",
        },
      ],
    };
  },
};
</script>
