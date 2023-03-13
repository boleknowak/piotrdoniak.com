import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SocialIcon({ social, source = 'other' }) {
  let { url } = social;
  url = url.replace('{source}', source);

  return (
    <a href={url} target="_blank" className="social-icon-item block" aria-label={social.name}>
      <div className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-100">
        <FontAwesomeIcon color={social.color} icon={social.icon} size="lg" className="w-5" />
      </div>
    </a>
  );
}
