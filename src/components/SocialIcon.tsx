import { Tooltip } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

export default function SocialIcon({ social: social_item, source = 'other' }) {
  const [social, setSocial] = useState(social_item);
  let { url } = social;
  url = url.replace('{source}', source);

  const updateSocialPing = async () => {
    try {
      const response = await fetch(`/api/socials/ping?id=${social.id}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (data.ping) {
        setSocial({ ...social, ping: data.ping });
      } else {
        setSocial({ ...social, ping: false });
      }
    } catch (error) {
      setSocial({ ...social, ping: false });
    }
  };

  useEffect(() => {
    updateSocialPing();
  }, []);

  return (
    <Tooltip
      label={social.ping ? `Nowa zawartość | ${social.name}` : social.name}
      placement="top"
      hasArrow={true}
    >
      <a href={url} target="_blank" className="social-icon-item block" aria-label={social.name}>
        <div className="relative flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-100">
          {social.ping && (
            <div className="absolute bottom-0 right-0 mb-0.5 mr-0.5 h-3 w-3 animate-ping rounded-full bg-yellow-500"></div>
          )}
          {social.ping && (
            <div className="absolute bottom-0 right-0 mb-0.5 mr-0.5 h-3 w-3 rounded-full border-2 border-white bg-yellow-500"></div>
          )}
          <FontAwesomeIcon color={social.color} icon={social.icon} size="lg" className="w-5" />
        </div>
      </a>
    </Tooltip>
  );
}
