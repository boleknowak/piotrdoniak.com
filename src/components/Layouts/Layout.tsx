import { Caveat } from 'next/font/google';
import Link from 'next/link';
import Item from '@/components/Menu/Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressCard,
  // faChartBar,
  faEnvelope,
  // faFloppyDisk,
  faFolder,
  // faKeyboard,
  // faLightbulb,
} from '@fortawesome/free-regular-svg-icons';
import { faBars, faX } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Footer from '@/components/Menu/Footer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import * as gtag from '@/lib/gtag';

const caveat = Caveat({ subsets: ['latin'] });

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [useGoogleAnalytics] = useLocalStorage('useGoogleAnalytics', 'accepted');

  useEffect(() => {
    gtag.manageConsent(useGoogleAnalytics);
  }, [useGoogleAnalytics]);

  const menu = [
    {
      id: 'o-mnie',
      name: 'O mnie',
      href: '/',
      icon: faAddressCard,
      subtext: null,
      type: 'element',
    },
    {
      id: 'projekty',
      name: 'Projekty',
      href: '/projekty',
      icon: faFolder,
      subtext: null,
      type: 'element',
    },
    {
      id: 'kontakt',
      name: 'Kontakt',
      href: '/kontakt',
      icon: faEnvelope,
      subtext: null,
      type: 'element',
    },
    // {
    //   id: 'separator-1',
    //   name: 'Kącik wiedzy', // Moje myśli, Mój świat, Kącik wiedzy
    //   type: 'category',
    // },
    // {
    //   id: 'marketing',
    //   name: 'Marketing',
    //   href: '/marketing',
    //   icon: faChartBar,
    //   subtext: null,
    //   type: 'element',
    // },
    // {
    //   id: 'kreatywnosc',
    //   name: 'Kreatywność',
    //   href: '/kreatywnosc',
    //   icon: faLightbulb,
    //   subtext: null,
    //   type: 'element',
    // },
    // {
    //   id: 'programowanie',
    //   name: 'Programowanie',
    //   href: '/programowanie',
    //   icon: faKeyboard,
    //   subtext: null,
    //   type: 'element',
    // },
    // {
    //   id: 'narzedzia',
    //   name: 'Narzędzia',
    //   href: '/narzedzia',
    //   icon: faFloppyDisk,
    //   subtext: null,
    //   type: 'element',
    // },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex flex-col xl:flex-row">
      <header className="block border-b border-yellow-500 bg-yellow-50 xl:hidden">
        <div className="flex flex-row items-center justify-between">
          <div>
            <Link href="/" className="ml-2 block p-2">
              <div className="text-3xl font-bold">
                <span className={caveat.className}>Piotr Doniak</span>
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
                  {item.type === 'category' && (
                    <div className="mt-6 mb-3 ml-2 text-xs text-gray-500">{item.name}</div>
                  )}
                  {item.type !== 'category' && (
                    <Item
                      key={item.id}
                      href={item.href}
                      onClick={toggleMenu}
                      subtext={item.subtext}
                    >
                      <FontAwesomeIcon icon={item.icon} size="lg" fixedWidth className="w-5" />
                      <div>{item.name}</div>
                    </Item>
                  )}
                </div>
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
                  <span className={caveat.className}>Piotr Doniak</span>
                </div>
              </Link>
              <div className="mt-6 space-y-1">
                {menu.map((item) => (
                  <div key={`side-${item.id}`}>
                    {item.type === 'category' && (
                      <div className="mt-6 mb-3 ml-2 text-xs text-gray-500">{item.name}</div>
                    )}
                    {item.type !== 'category' && (
                      <Item key={item.id} href={item.href} subtext={item.subtext}>
                        <FontAwesomeIcon icon={item.icon} size="lg" fixedWidth className="w-5" />
                        <div>{item.name}</div>
                      </Item>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mx-4 -mt-12">
            <Footer />
          </div>
        </div>
      </aside>
      <main className="w-full p-4">{children}</main>
    </div>
  );
}
