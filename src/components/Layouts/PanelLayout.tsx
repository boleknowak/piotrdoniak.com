import { Caveat } from 'next/font/google';
import Image from 'next/image';
import Item from '@/components/Menu/Item';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressCard,
  faCalendar,
  faComment,
  faEnvelope,
  faFileLines,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBars,
  faPersonThroughWindow,
  faRss,
  faSignOut,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { UserInterface } from '@/interfaces/UserInterface';
import getMessages from '@/lib/getMessages';
import Unauthorized from '../Unauthorized';
import LoadingPage from '../LoadingPage';

const caveat = Caveat({ subsets: ['latin'] });

export default function PanelLayout({ children }) {
  const { data: session, status: authed } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (authed === 'loading') return <LoadingPage />;
  if (authed === 'unauthenticated') {
    signIn('google');
    return <LoadingPage />;
  }

  const user = session?.user as UserInterface;

  const isAuthorized = user?.is_authorized;
  const isAuthed = authed === 'authenticated';

  const menu = [
    {
      id: 'wyjdz',
      name: 'Wyjdź z panelu',
      type: 'element',
      href: '/',
      icon: faPersonThroughWindow,
      subtext: null,
      authorizedRoute: true,
    },
    {
      id: 'category-1',
      name: 'Ogólne',
      type: 'category',
      authorizedRoute: true,
    },
    {
      id: 'strona-glowna',
      name: 'Informacje',
      type: 'element',
      href: '/panel',
      icon: faAddressCard,
      subtext: null,
      authorizedRoute: true,
    },
    {
      id: 'kalendarz',
      name: 'Kalendarz',
      type: 'element',
      href: '/panel/kalendarz',
      icon: faCalendar,
      subtext: null,
      authorizedRoute: true,
    },
    {
      id: 'wiadomosci',
      name: 'Wiadomości',
      type: 'element',
      href: '/panel/wiadomosci',
      icon: faEnvelope,
      subtext: null,
      authorizedRoute: true,
    },
    {
      id: 'category-2',
      name: 'Treść',
      type: 'category',
      authorizedRoute: true,
    },
    {
      id: 'wpisy',
      name: 'Wpisy',
      type: 'element',
      href: '/panel/wpisy',
      icon: faComment,
      subtext: null,
      authorizedRoute: true,
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      type: 'element',
      href: '/panel/newsletter',
      icon: faRss,
      subtext: null,
      authorizedRoute: true,
    },
    {
      id: 'ustawienia',
      name: 'Ustawienia',
      type: 'element',
      href: '/panel/ustawienia',
      icon: faFileLines,
      subtext: null,
      authorizedRoute: true,
    },
    {
      id: 'autorzy',
      name: 'Autorzy',
      type: 'element',
      href: '/panel/autorzy',
      icon: faUser,
      subtext: null,
      authorizedRoute: true,
    },
  ];

  const messages = getMessages({ onlyCount: true });

  if (messages.data) {
    menu.map((item) => {
      if (item.id === 'wiadomosci') {
        item.subtext = messages.data.count || null;
      }

      return item;
    });
  }

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
            <Link href="/panel" className="ml-2 block p-2">
              <div className="text-3xl font-bold">
                <span className={caveat.className}>Panel</span>
              </div>
            </Link>
          </div>
          <div>
            <button
              type="button"
              onClick={toggleMenu}
              className="mr-2 flex h-12 w-12 items-center justify-center rounded-md hover:bg-yellow-100"
              aria-label="Rozwiń menu"
            >
              {!menuOpen && <FontAwesomeIcon icon={faBars} size="lg" fixedWidth className="w-5" />}
              {menuOpen && <FontAwesomeIcon icon={faX} size="sm" fixedWidth className="w-4" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mx-4 mb-4">
            <div className="mt-2 space-y-1">
              {menu.map((item) => (
                <div key={`nav-${item.id}`}>
                  {isAuthed && isAuthorized && item.authorizedRoute && (
                    <div>
                      {item.type === 'category' && (
                        <div className="mt-6 mb-3 ml-2 text-xs text-gray-500">{item.name}</div>
                      )}
                      {item.type !== 'category' && (
                        <Item href={item.href} subtext={item.subtext} onClick={toggleMenu}>
                          <FontAwesomeIcon icon={item.icon} size="lg" fixedWidth className="w-5" />
                          <div>{item.name}</div>
                        </Item>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <hr />
              <div className="mt-4">
                {isAuthed && (
                  <div className="flex flex-row items-center justify-between">
                    <Link href={`/panel/autorzy/${user.slug}`}>
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
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="h-10 w-10 rounded-md hover:bg-white"
                    >
                      <FontAwesomeIcon icon={faSignOut} size="lg" fixedWidth className="w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      <aside className="sticky top-0 hidden h-screen xl:block">
        <div className="min-h-96 m-2 hidden h-[98%] max-h-screen w-72 overflow-y-auto rounded border border-yellow-500 bg-yellow-50 xl:block">
          <div className="items-between flex h-full flex-grow flex-col">
            <div className="mb-32 h-full p-4">
              <Link href="/panel" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                <div className="text-3xl font-bold">
                  <span className={caveat.className}>Panel</span>
                </div>
              </Link>
              <div className="mt-6">
                <div className="space-y-1">
                  {menu.map((item) => (
                    <div key={`side-${item.id}`}>
                      {isAuthed && isAuthorized && item.authorizedRoute && (
                        <div>
                          {item.type === 'category' && (
                            <div className="mt-6 mb-3 ml-2 text-xs text-gray-500">{item.name}</div>
                          )}
                          {item.type !== 'category' && (
                            <Item href={item.href} subtext={item.subtext}>
                              <FontAwesomeIcon
                                icon={item.icon}
                                size="lg"
                                fixedWidth
                                className="w-5"
                              />
                              <div>{item.name}</div>
                            </Item>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-4 mt-10 pb-2">
              <div>
                {isAuthed && (
                  <div className="flex flex-row items-center justify-between">
                    <Link href={`/panel/autorzy/${user.slug}`}>
                      <div className="flex flex-row items-center space-x-2 bg-yellow-50">
                        <Image
                          src={user.image}
                          width={32}
                          height={32}
                          className="rounded-full"
                          alt="Avatar"
                        />
                        <div className="text-sm">{user.name}</div>
                      </div>
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="h-10 w-10 rounded-md bg-yellow-50 hover:bg-white"
                    >
                      <FontAwesomeIcon icon={faSignOut} size="lg" fixedWidth className="w-5" />
                    </button>
                  </div>
                )}
              </div>
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
