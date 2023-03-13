import { Caveat } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import Item from '@/components/Menu/Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faBars, faPersonThroughWindow, faSignOut, faX } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Footer from '@/components/Menu/Footer';
import { useSession, signIn, signOut } from 'next-auth/react';
import { UserInterface } from '@/interfaces/UserInterface';
import Unauthorized from '../Unauthorized';

const caveat = Caveat({ subsets: ['latin'] });

export default function PanelLayout({ children }) {
  const { data: session, status: authed } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (authed === 'loading') return <div>Loading...</div>;
  if (authed === 'unauthenticated') {
    signIn('google');
    return <div>Redirecting...</div>;
  }

  const user = session?.user as UserInterface;

  const isAuthorized = user?.is_authorized;
  const isAuthed = authed === 'authenticated';

  const menu = [
    {
      id: 1,
      name: 'Wyjdź z panelu',
      href: '/',
      icon: faPersonThroughWindow,
      authorizedRoute: true,
    },
    {
      id: 2,
      name: 'Główna panelu',
      href: '/panel',
      icon: faAddressCard,
      authorizedRoute: true,
    },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const logout = () => {
    signOut({
      callbackUrl: '/',
    });
  };

  return (
    <div className="flex flex-col xl:flex-row">
      <header className="block border-b border-yellow-500 bg-yellow-50 xl:hidden">
        <div className="flex flex-row items-center justify-between">
          <div>
            <Link href="/" className="ml-2 block p-2">
              <div className="text-3xl font-bold">
                <span className={caveat.className}>Panel</span>
              </div>
            </Link>
          </div>
          <div>
            <button
              type="button"
              onClick={toggleMenu}
              className="mr-2 block h-12 w-12 rounded-md hover:bg-yellow-100"
            >
              {!menuOpen && <FontAwesomeIcon icon={faBars} size="lg" fixedWidth className="w-5" />}
              {menuOpen && <FontAwesomeIcon icon={faX} size="lg" fixedWidth className="w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mx-4 mb-4">
            <div className="mt-2 space-y-1">
              {menu.map((item) => (
                <Item key={item.id} href={item.href} onClick={toggleMenu}>
                  <FontAwesomeIcon icon={item.icon} size="lg" fixedWidth className="w-5" />
                  <div>{item.name}</div>
                </Item>
              ))}
            </div>
            <div className="mt-4">
              <hr />
              <div className="mt-4">
                <Footer />
              </div>
            </div>
          </div>
        )}
      </header>
      <aside className="sticky top-0 hidden h-screen xl:block">
        <div className="m-2 hidden h-[98%] w-72 rounded border border-yellow-500 bg-yellow-50 xl:block">
          <div className="items-between flex h-full flex-col">
            <div className="p-4">
              <Link href="/">
                <div className="text-3xl font-bold">
                  <span className={caveat.className}>Panel</span>
                </div>
              </Link>
              <div className="mt-6 space-y-1">
                {menu.map((item) => (
                  <div>
                    {isAuthed && isAuthorized && item.authorizedRoute && (
                      <Item key={item.id} href={item.href}>
                        <FontAwesomeIcon icon={item.icon} size="lg" fixedWidth className="w-5" />
                        <div>{item.name}</div>
                      </Item>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mx-4 -mt-14">
            <div>
              {isAuthed && (
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center space-x-2">
                    <Image
                      src={user.image}
                      width={32}
                      height={32}
                      className="rounded-full"
                      alt="Avatar"
                    />
                    <div className="text-sm">{user.name}</div>
                  </div>
                  <button onClick={() => logout()} className="h-10 w-10 rounded-md hover:bg-white">
                    <FontAwesomeIcon icon={faSignOut} size="lg" fixedWidth className="w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
      <main className="w-full p-4">
        {isAuthed && isAuthorized && <div>{children}</div>}
        {isAuthed && !isAuthorized && <Unauthorized />}
      </main>
    </div>
  );
}
