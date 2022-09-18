import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const timeAgo = (time) => {
  dayjs.extend(relativeTime);
  return dayjs(time).fromNow();
};

const parseTime = (time) => {
  return dayjs("2012-01-25" + time).format("hh:mm A");
};

const weekdays = [
  {
    label: "Monday",
    value: "monday",
  },
  {
    label: "Tuesday",
    value: "tuesday",
  },
  {
    label: "Wednesday",
    value: "wednesday",
  },
  {
    label: "Thursday",
    value: "thursday",
  },
  {
    label: "Friday",
    value: "friday",
  },
  {
    label: "Saturday",
    value: "saturday",
  },
  {
    label: "Sunday",
    value: "sunday",
  },
];

export { parseTime, weekdays, timeAgo };
