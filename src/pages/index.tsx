// import { useFetch } from '@/hooks/useFetch';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import * as gtag from '@/lib/gtag';
import { useEffect } from 'react';
import Layout from '@/components/Layouts/Layout';
import { Sofia } from 'next/font/google';
import Image from 'next/image';
import SeoTags from '@/components/SeoTags';

const sofia = Sofia({ subsets: ['latin'], weight: '400' });

export default function Home({ siteMeta }) {
  // const { data, loading, error } = useFetch('/api/posts');
  const [useGoogleAnalytics /* , setUseGoogleAnalytics */] = useLocalStorage(
    'useGoogleAnalytics',
    'accepted'
  );

  useEffect(() => {
    gtag.manageConsent(useGoogleAnalytics);
  }, [useGoogleAnalytics]);

  // if (error) return <div>An error occured.</div>;

  // const toggleUseGoogleAnalytics = (event) => {
  //   if (event.target.checked) {
  //     setUseGoogleAnalytics('accepted');
  //   } else {
  //     setUseGoogleAnalytics('rejected');
  //   }
  // };

  // const getGoogleAnalyticsStatus = () => useGoogleAnalytics;

  return (
    <>
      <SeoTags title={siteMeta?.title} />
      <Layout>
        <div className="flex h-full w-full items-center justify-center">
          <div>
            <div className="w-full max-w-2xl text-[#43403C]">
              <Image
                src="/images/homepage.png"
                alt="To ja, Piotrek"
                title="To ja, Piotrek"
                width={600}
                height={286}
                className="mb-10 rounded-lg"
                quality={80}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcUg8AAe0BNUeV1/kAAAAASUVORK5CYII="
              />
              {/* https://png-pixel.com/ b4b4b4 */}
              <h1 className="mb-4 text-2xl font-bold">Cześć!</h1>
              <div className="space-y-4 leading-6 tracking-wide">
                <p>
                  To ja, Piotrek — student e-marketingu. Swoją przygodę zacząłem od programowania,
                  <br />a obecnie zależy mi na{' '}
                  <span className="underline decoration-dotted underline-offset-4" title="Poznań">
                    POZ
                  </span>
                  naniu się ze światem marketingu.
                </p>
                <p>
                  Zdobywanie wiedzy uważam za możliwość rozwoju, a dzięki temu coraz szybciej i
                  lepiej wykonuję zadania.
                </p>
                <p>
                  Zapraszam Cię do zapoznania się z moimi projektami oraz wpisami na blogu
                  {` `}
                  <span className={sofia.className}>:)</span>
                </p>
              </div>
            </div>
            {/* {loading && false && <div>Loading ...</div>}
            {!loading && false && (
              <div>
                <div className="mt-4">
                  <label htmlFor="useGoogleAnalytics" className="mr-2">
                    Use Google Analytics ({getGoogleAnalyticsStatus()})
                  </label>
                  <input
                    type="checkbox"
                    id="useGoogleAnalytics"
                    checked={useGoogleAnalytics === 'accepted'}
                    onChange={toggleUseGoogleAnalytics}
                  />
                </div>
              </div>
            )} */}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async () => {
  const meta = {
    title: 'Poznaj mnie - Piotr Doniak',
  };

  return {
    props: {
      siteMeta: meta,
    },
  };
};
