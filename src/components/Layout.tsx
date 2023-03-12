// import { EnvelopeSimple, FolderOpen, House } from '@phosphor-icons/react';
import { Caveat } from 'next/font/google';
import Link from 'next/link';
import Item from '@/components/Menu/Item';

const caveat = Caveat({ subsets: ['latin'] });

export default function Layout({ children }) {
  return (
    <div className="flex">
      <aside className="sticky top-0 h-screen">
        <div className="m-2 hidden h-[98%] w-72 rounded border border-yellow-500 bg-yellow-50 xl:block">
          <div className="p-4">
            <Link href="/">
              <div className="text-3xl font-bold">
                <span className={caveat.className}>Piotr Doniak</span>
              </div>
            </Link>
            <div className="mt-6 space-y-1">
              <Item href="/">
                {/* <House weight="regular" size={20} /> */}
                <div>Strona Główna</div>
              </Item>
              <Item href="/projekty">
                {/* <FolderOpen weight="regular" size={20} /> */}
                <div>Projekty</div>
              </Item>
              <Item href="/kontakt">
                {/* <EnvelopeSimple weight="regular" size={20} /> */}
                <div>Kontakt</div>
              </Item>
            </div>
          </div>
        </div>
      </aside>
      <main className="m-4 w-full">{children}</main>
    </div>
  );
}
