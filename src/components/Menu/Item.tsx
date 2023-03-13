import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Item({ children, href, subtext, ...props }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`flex flex-row items-center justify-between rounded p-2 text-sm text-black transition-all duration-100 ease-in-out ${
        isActive && 'bg-[#42403B] !text-white'
      } ${!isActive && 'hover:bg-[#42403B] hover:text-white'}`}
    >
      <div className="flex flex-row items-center space-x-2" {...props}>
        {children}
      </div>
      {subtext && <div className="rounded bg-orange-100 px-1 text-black">{subtext}</div>}
    </Link>
  );
}
