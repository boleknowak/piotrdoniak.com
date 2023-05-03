import { Caveat } from 'next/font/google';
import Link from 'next/link';
import Item from '@/components/Menu/Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faX } from '@fortawesome/free-solid-svg-icons';
import { MdOutlineLightbulb } from 'react-icons/md';
import { HiOutlineFolderOpen, HiOutlineSparkles } from 'react-icons/hi';
import { IoMegaphoneOutline } from 'react-icons/io5';
import { BiCodeAlt, BiEnvelope, BiIdCard } from 'react-icons/bi';
import React, { useEffect, useState } from 'react';
import Footer from '@/components/Menu/Footer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import * as gtag from '@/lib/gtag';
// import Image from 'next/image';

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
      icon: <BiIdCard />,
      subtext: null,
      type: 'element',
    },
    {
      id: 'projekty',
      name: 'Projekty',
      href: '/projekty',
      icon: <HiOutlineFolderOpen />,
      subtext: null,
      type: 'element',
    },
    {
      id: 'kontakt',
      name: 'Kontakt',
      href: '/kontakt',
      icon: <BiEnvelope />,
      subtext: null,
      type: 'element',
    },
    {
      id: 'separator-1',
      name: 'Kącik wiedzy', // Moje myśli, Mój świat, Kącik wiedzy
      type: 'category',
    },
    {
      id: 'marketing',
      name: 'Marketing',
      href: '/wiedza/marketing',
      icon: <IoMegaphoneOutline />,
      subtext: null,
      type: 'element',
    },
    {
      id: 'kreatywnosc',
      name: 'Kreatywność',
      href: '/wiedza/kreatywnosc',
      icon: <MdOutlineLightbulb />,
      subtext: null,
      type: 'element',
    },
    {
      id: 'programowanie',
      name: 'Programowanie',
      href: '/wiedza/programowanie',
      icon: <BiCodeAlt />,
      subtext: null,
      type: 'element',
    },
    {
      id: 'inne',
      name: 'Inne',
      href: '/wiedza/inne',
      icon: <HiOutlineSparkles />,
      subtext: null,
      type: 'element',
    },
    // {
    //   id: 'narzedzia',
    //   name: 'Narzędzia',
    //   href: '/wiedza/narzedzia',
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
                    <div className="mb-3 ml-2 mt-6 text-xs text-gray-500">{item.name}</div>
                  )}
                  {item.type !== 'category' && (
                    <Item
                      key={item.id}
                      href={item.href}
                      onClick={toggleMenu}
                      subtext={item.subtext}
                    >
                      <div className="text-xl">{item.icon}</div>
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
              <div className="flex flex-row items-center justify-between">
                <div>
                  <Link href="/" className="block">
                    <div className="text-3xl font-bold">
                      <span className={caveat.className}>Piotr Doniak</span>
                    </div>
                  </Link>
                </div>
                <div>
                  {/* <Image
                    src="/images/brand/me.png"
                    alt="To ja!"
                    width={48}
                    height={48}
                    className="rounded-full"
                  /> */}
                </div>
              </div>
              <div className="mt-6 space-y-1">
                {menu.map((item) => (
                  <div key={`side-${item.id}`}>
                    {item.type === 'category' && (
                      <div className="mb-3 ml-2 mt-6 text-xs text-gray-500">{item.name}</div>
                    )}
                    {item.type !== 'category' && (
                      <Item key={item.id} href={item.href} subtext={item.subtext}>
                        <div className="text-xl">{item.icon}</div>
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
