import { socials } from '@/lib/socials';
import SocialIcon from '@/components/SocialIcon';

export default function Footer() {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="text-xs text-gray-500">
        <div>&copy; 2023</div>
        <div>Piotr Doniak</div>
      </div>
      <div>
        <div className="flex flex-row items-center justify-center space-x-1">
          {/* <div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md hover:border hover:border-gray-200 hover:bg-white"
            >
              <FontAwesomeIcon icon={faMoon} color="#212121" size="sm" className="w-6" />
              <FontAwesomeIcon icon={faSun} color="#EAB308" size="sm" className="w-6" />
            </button>
          </div> */}
          {socials.map((social) => (
            <SocialIcon key={social.id} social={social} source="menu" />
          ))}
        </div>
      </div>
    </div>
  );
}
