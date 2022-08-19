<template>
  <div class="row q-col-gutter-md">
    <div class="col-12">
      <p class="text-bold">{{ $t("common.date") }}</p>
      <q-input
        style="max-width: 250px"
        outlined
        v-model="fromAndtoDateFake"
        :label="$t('common.fromAndtoDate')"
      >
        <template v-slot:append>
          <q-icon name="eva-calendar-outline" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                range
                v-model="fromAndtoDate"
                @update:model-value="
                  () =>
                    (fromAndtoDateFake = `${fromAndtoDate.from} - ${fromAndtoDate.to}`)
                "
              >
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    :label="$t('action.close')"
                    color="primary"
                    flat
                  />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-12">
      <p class="text-bold">{{ $t("common.time") }}</p>
      <q-input
        style="max-width: 200px"
        outlined
        v-model="fromTime"
        mask="time"
        :rules="['time']"
        :label="$t('common.fromTime')"
      >
        <template v-slot:append>
          <q-icon name="eva-clock-outline" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="fromTime">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        style="max-width: 200px"
        outlined
        v-model="toTime"
        mask="time"
        :rules="['time']"
        :label="$t('common.toTime')"
      >
        <template v-slot:append>
          <q-icon name="eva-clock-outline" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="toTime">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-12 text-center">
      <q-btn
        :loading="loading"
        @click="createSchedule"
        :disabled="!fromAndtoDate || !fromTime || !toTime"
        push
        color="primary"
        text-color="white"
        icon="eva-paper-plane-outline"
        :label="$t('action.sendReservation')"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ComponentScheduleCreateForm",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { emit }) {
    const fromAndtoDate = ref({ from: "", to: "" });
    const fromAndtoDateFake = ref("");
    const fromTime = ref(null);
    const toTime = ref(null);

    return {
      fromAndtoDate,
      fromAndtoDateFake,
      fromTime,
      toTime,
      createSchedule() {
        emit("createSchedule", {
          fromDate: fromAndtoDate.value.from,
          toDate: fromAndtoDate.value.to,
          fromTime: `${fromTime.value}:00`,
          toTime: `${toTime.value}:00`,
        });
      },
    };
  },
};
</script>
