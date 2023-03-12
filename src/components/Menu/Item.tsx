import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Item({ children, href, ...props }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} className="block">
      <div
        className={`flex flex-row items-center space-x-2 rounded p-2 text-sm text-black transition-all duration-100 ease-in-out ${
          isActive && 'bg-[#42403B] !text-white'
        } ${!isActive && 'hover:bg-[#42403B] hover:text-white'}`}
        {...props}
      >
        {children}
      </div>
    </Link>
  );
}
