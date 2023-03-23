import Badge from '@/components/Elements/Badge';
import { faCheckCircle, faClock, faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  status: string | 'CLOSED' | 'PENDING' | 'VIEWED' | 'DRAFT';
}

export default function StatusBadge({ status }: Props) {
  return (
    <Badge
      variant={
        (status === 'CLOSED' && 'outlined-green') ||
        (status === 'PENDING' && 'outlined-orange') ||
        (status === 'VIEWED' && 'outlined-blue') ||
        (status === 'DRAFT' && 'outlined-purple') ||
        'outlined-gray'
      }
      additionalClasses="flex flex-row items-center space-x-1"
    >
      <FontAwesomeIcon
        icon={
          (status === 'CLOSED' && faCheckCircle) ||
          (status === 'PENDING' && faClock) ||
          (status === 'VIEWED' && faEye) ||
          (status === 'DRAFT' && faPenToSquare) ||
          faCheckCircle
        }
        size="sm"
        className="-ml-1 mr-0.5 w-3"
      />
      {status === 'PENDING' && <div>Oczekujące</div>}
      {status === 'VIEWED' && <div>Wyświetlone</div>}
      {status === 'DRAFT' && <div>Szkic</div>}
      {status === 'CLOSED' && <div>Wykonane</div>}
    </Badge>
  );
}
