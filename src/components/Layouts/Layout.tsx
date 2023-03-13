import { Caveat } from 'next/font/google';
import Link from 'next/link';
import Item from '@/components/Menu/Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faEnvelope, faFolder } from '@fortawesome/free-regular-svg-icons';
import { faBars, faX } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Footer from '@/components/Menu/Footer';

const caveat = Caveat({ subsets: ['latin'] });

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menu = [
    {
      id: 1,
      name: 'O mnie',
      href: '/',
      icon: faAddressCard,
      subtext: null,
    },
    {
      id: 2,
      name: 'Projekty',
      href: '/projekty',
      icon: faFolder,
      subtext: null,
    },
    {
      id: 3,
      name: 'Kontakt',
      href: '/kontakt',
      icon: faEnvelope,
      subtext: null,
    },
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
              className="mr-2 block h-12 w-12 rounded-md hover:bg-yellow-100"
              aria-label="Rozwiń menu"
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
                <Item key={item.id} href={item.href} onClick={toggleMenu} subtext={item.subtext}>
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
                  <span className={caveat.className}>Piotr Doniak</span>
                </div>
              </Link>
              <div className="mt-6 space-y-1">
                {menu.map((item) => (
                  <Item key={item.id} href={item.href} subtext={item.subtext}>
                    <FontAwesomeIcon icon={item.icon} size="lg" fixedWidth className="w-5" />
                    <div>{item.name}</div>
                  </Item>
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
