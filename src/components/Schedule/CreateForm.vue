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
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date
            :navigation-min-year-month="currentYearMotnh"
            range
            :options="rangeOptions"
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
        <template v-slot:append>
          <q-icon name="eva-calendar-outline" class="cursor-pointer"> </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-12 q-gutter-md">
      <p class="text-bold">{{ $t("common.time") }}</p>
      <q-input
        style="max-width: 200px"
        outlined
        v-model="fromTimeFake"
        :label="$t('common.fromTime')"
      >
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time
            @update:model-value="onChangeFromTime"
            :options="timeOptions"
            v-model="fromTime"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
        <template v-slot:append>
          <q-icon name="eva-clock-outline" class="cursor-pointer"> </q-icon>
        </template>
      </q-input>
      <q-input
        style="max-width: 200px"
        outlined
        v-model="toTimeFake"
        :label="$t('common.toTime')"
      >
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time
            @update:model-value="onChangeToTime"
            :options="timeOptions"
            v-model="toTime"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
        <template v-slot:append>
          <q-icon name="eva-clock-outline" class="cursor-pointer"> </q-icon>
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
import { parseTime } from "src/utils/time";

export default {
  name: "ComponentScheduleCreateForm",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    availableWeekDays: {
      type: Array,
      default: () => [],
    },
    opensAt: {
      type: String,
      default: "",
    },
    closesAt: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const fromAndtoDate = ref({ from: "", to: "" });
    const fromAndtoDateFake = ref("");
    const fromTime = ref(null);
    const fromTimeFake = ref(""); // To give mask
    const toTime = ref(null);
    const toTimeFake = ref(""); // To give mask

    const date = new Date();
    const currentYearMotnh =
      date.getFullYear() +
      "/" +
      (date.getMonth() + 1).toString().padStart(2, "0");

    return {
      fromAndtoDate,
      fromAndtoDateFake,
      fromTime,
      toTime,
      currentYearMotnh,
      fromTimeFake,
      toTimeFake,
      createSchedule() {
        emit("createSchedule", {
          fromDate: fromAndtoDate.value.from,
          toDate: fromAndtoDate.value.to,
          fromTime: `${fromTime.value}:00`,
          toTime: `${toTime.value}:00`,
        });
      },
      rangeOptions(date) {
        const weekDay = new Date(date).toLocaleString("en-us", {
          weekday: "long",
        });
        return props.availableWeekDays.includes(weekDay.toLocaleLowerCase());
      },
      timeOptions(hr, min) {
        const opensAtHour = Number(props.opensAt.substring(0, 2));
        const opensAtMin = Number(props.opensAt.substring(3, 5));

        const closesAtHour = Number(props.closesAt.substring(0, 2));
        const closesAtMin = Number(props.closesAt.substring(3, 5));

        if (hr !== null && hr >= opensAtHour && hr <= closesAtHour) {
          return true;
        }

        if (min !== null && min >= opensAtMin && min <= closesAtMin) {
          return true;
        }
      },
      onChangeFromTime(time) {
        fromTimeFake.value = parseTime(time);
      },
      onChangeToTime(time) {
        toTimeFake.value = parseTime(time);
      },
    };
  },
};
</script>
