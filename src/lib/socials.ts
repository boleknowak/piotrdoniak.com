import { faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export const socials = [
  {
    id: 1,
    name: 'LinkedIn',
    text: 'Piotr Doniak',
    icon: faLinkedin,
    color: '#0a66c2',
    url: 'https://www.linkedin.com/in/piotrdoniak/?utm_source=piotrdoniak.com&utm_medium=portfolio&utm_campaign={source}',
    ping: false,
  },
  {
    id: 2,
    name: 'GitHub',
    text: 'boleknowak',
    icon: faGithub,
    color: '#333',
    url: 'https://github.com/boleknowak/?utm_source=piotrdoniak.com&utm_medium=portfolio&utm_campaign={source}',
    ping: false,
  },
  {
    id: 3,
    name: 'Instagram',
    text: 'piotrdoniak',
    icon: faInstagram,
    color: '#e1306c',
    url: 'https://www.instagram.com/piotrdoniak/?utm_source=piotrdoniak.com&utm_medium=portfolio&utm_campaign={source}',
    ping: false,
  },
];
