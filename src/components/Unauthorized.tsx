import { Sofia } from 'next/font/google';
import Image from 'next/image';

const sofia = Sofia({ subsets: ['latin'], weight: '400' });

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/images/other/man-with-notebook.png"
        width={300}
        height={300}
        alt="To Ty!"
        className="mt-20 mb-4"
      />
      <div className="text-2xl font-bold">Hej! Jak tu wszedłeś?</div>
      <div className="text-xl">Nie ma tu jeszcze niczego przygotowanego dla Ciebie.</div>
      <div className="mt-2 text-sm text-gray-600">
        ... ale może kiedyś to się zmieni <span className={sofia.className}>;)</span>
      </div>
    </div>
  );
}
