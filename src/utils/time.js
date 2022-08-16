import dayjs from 'dayjs';

const parseTime = (time) => {
  return dayjs("2012-01-25" + time).format("hh:mm A");
};

export { parseTime };
