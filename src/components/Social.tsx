import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Social({ social }) {
  return (
    <a href={social.url} target="_blank" className="block">
      <div className="flex flex-row items-center space-x-2 rounded-md border border-gray-200 bg-white p-4 transition duration-300 hover:scale-105 hover:bg-gray-100">
        <FontAwesomeIcon color={social.color} icon={social.icon} size="lg" />
        <div>{social.text}</div>
      </div>
    </a>
  );
}
