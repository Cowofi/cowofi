<template>
  <q-card style="max-width: 350px" flat bordered>
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
        </div>
        <div class="col-12">
          <q-icon size="xs" name="eva-clock-outline" />
          {{ $t("common.at") }} {{ parseTime(schedule.from_time) }} -
          {{ parseTime(schedule.to_time) }}
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
    schedule: {
      type: Object,
      required: true,
    },
  },
  components: { SpaceMinimal },
  setup() {
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
    };
  },
};
</script>
