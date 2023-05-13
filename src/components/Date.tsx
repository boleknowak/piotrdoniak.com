import { parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { utcToZonedTime, format } from 'date-fns-tz';

type Props = {
  dateString: string;
  withTime?: boolean;
  onlyTime?: boolean;
  fullDate?: boolean;
};

export default function DateComponent({
  dateString,
  withTime = false,
  onlyTime = false,
  fullDate = false,
}: Props) {
  const date = parseISO(dateString);
  const zonedDate = utcToZonedTime(date, 'Europe/Warsaw');
  let pattern = 'd LLLL yyyy';

  if (withTime) {
    pattern = 'd LLLL yyyy, HH:mm';
  }

  if (onlyTime) {
    pattern = 'HH:mm';
  }

  if (fullDate) {
    pattern = 'dd.MM.yyyy';
  }

  return (
    <time dateTime={dateString}>
      {format(zonedDate, pattern, { locale: pl, timeZone: 'Europe/Warsaw' })}
    </time>
  );
}
