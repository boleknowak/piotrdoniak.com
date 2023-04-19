import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);

export const currentTime = (date = null) => {
  if (date) {
    return dayjs(date).toDate();
  }

  return dayjs().toDate();
};
