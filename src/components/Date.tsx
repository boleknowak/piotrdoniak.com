import { parseISO, format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function Date({ dateString, withTime = false, onlyTime = false }) {
  const date = parseISO(dateString);

  if (withTime) {
    return <time dateTime={dateString}>{format(date, 'd LLLL yyyy, HH:mm', { locale: pl })}</time>;
  }

  if (onlyTime) {
    return <time dateTime={dateString}>{format(date, 'HH:mm', { locale: pl })}</time>;
  }

  return <time dateTime={dateString}>{format(date, 'd LLLL yyyy', { locale: pl })}</time>;
}
