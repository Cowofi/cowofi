<template>
  <q-card class="shedule-container" :id="customId + schedule.id" style="max-width: 350px" flat bordered>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-icon size="xs" name="eva-calendar-outline" />
          {{ $t("common.from") }} {{ schedule.from_date }}
          {{ $t("common.to") }} {{ schedule.to_date }}
          <span class="text-italic text-grey-8">
            ({{ getDateDiff(schedule.from_date, schedule.to_date) }})
          </span>
          <q-chip
            icon="eva-award-outline"
            size="sm"
            :color="
              getDateDiffFromNow(schedule.from_date) > 0 ? 'primary' : 'grey-4'
            "
            :text-color="
              getDateDiffFromNow(schedule.from_date) > 0 ? 'white' : 'black'
            "
          >
            {{
              getDateDiffFromNow(schedule.from_date) < 0
                ? `${getDateDiffFromNow(schedule.from_date)
                    .toString()
                    .replace("-", "")} ${$t("common.dayAgo")}`
                : `${$t("common.in")} ${getDateDiffFromNow(
                    schedule.from_date
                  )} ${$t("common.days")}`
            }}
          </q-chip>
          <q-chip
            :color="getStatusColor(schedule.status)"
            :text-color="schedule.status === 'pending' ? 'black' : 'white'"
            size="10px"
          >
            {{ $t(`common.${schedule.status}`) }}
          </q-chip>
        </div>
        <div class="col-12">
          <q-icon size="xs" name="eva-clock-outline" />
          {{ $t("common.at") }} {{ parseTime(schedule.from_time) }} -
          {{ parseTime(schedule.to_time) }}
        </div>
        <div class="col-12" v-if="showActions">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-btn
                :loading="loading"
                @click="onAccept()"
                push
                color="primary"
                text-color="white"
                :label="$t('action.accept')"
              />
            </div>
            <div class="col-6 text-right">
              <q-btn
                :loading="loading"
                @click="onReject()"
                push
                color="negative"
                :label="$t('action.reject')"
              />
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-separator />
        </div>
        <div class="col-12">
          <q-icon size="xs" name="eva-person-outline" />
          <span>{{ schedule.users.raw_user_meta_data.full_name }}</span>
          <space-minimal class="q-mt-xs" :space="schedule.spaces" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { parseTime } from "src/utils/time";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import SpaceMinimal from "components/Space/SpaceMinimal.vue";

export default {
  name: "ComponentScheduleMiniCard",
  props: {
    customId: {
      type: String,
      default: "",
    },
    schedule: {
      type: Object,
      required: true,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: { SpaceMinimal },
  setup(_, { emit }) {
    const $t = useI18n().t;

    return {
      parseTime,
      getDateDiffFromNow(from) {
        const now = dayjs();
        const fromDate = dayjs(from);
        const diff = fromDate.diff(now, "days");
        return diff;
      },
      getDateDiff(from, to) {
        const fromDate = dayjs(from);
        const toDate = dayjs(to);
        const diff = toDate.diff(fromDate, "days");
        return diff + " " + $t("common.days");
      },
      onAccept() {
        emit("accept");
      },
      onReject() {
        emit("reject");
      },
      getStatusColor(status) {
        switch (status) {
          case "pending":
            return "grey-4";
          case "accepted":
            return "primary";
          case "rejected":
            return "negative";
          default:
            return "grey-4";
        }
      },
    };
  },
};
</script>
