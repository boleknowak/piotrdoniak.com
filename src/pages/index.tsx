import Layout from '@/components/Layouts/Layout';
import Image from 'next/image';
import SeoTags from '@/components/SeoTags';
import FontWrapper from '@/components/FontWrapper';

export default function Home({ siteMeta }) {
  return (
    <>
      <SeoTags title={siteMeta?.title} />
      <Layout>
        <div className="flex h-full w-full items-center justify-center">
          <div>
            <div className="w-full max-w-2xl text-[#212121]">
              <Image
                src="/images/homepage.png"
                alt="To ja, Piotrek"
                title="To ja, Piotrek"
                width={600}
                height={286}
                className="mb-10 rounded-lg"
                quality={75}
                priority={true}
                // placeholder="blur"
                // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcUg8AAe0BNUeV1/kAAAAASUVORK5CYII="
              />
              {/* https://png-pixel.com/ b4b4b4 */}
              <h1 className="mb-4 text-2xl font-bold">Cześć!</h1>
              <div className="space-y-4 leading-6 tracking-wide">
                <p>
                  To ja, Piotrek — student e-marketingu o kreatywnym nastawieniu. Swoją przygodę
                  zacząłem od programowania, a teraz chcę się poznać ze światem marketingu, aby
                  wykorzystywać go w różnych projektach.
                </p>
                <p>
                  Zdobywanie wiedzy uważam za możliwość rozwoju, a dzięki temu coraz szybciej i
                  lepiej wykonuję zadania.
                </p>
                <p>
                  Zapraszam Cię do zapoznania się z moimi projektami oraz wpisami na blogu
                  {` `}
                  <FontWrapper font="sofia">:)</FontWrapper>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const meta = {
    title: 'Poznaj mnie - Piotr Doniak',
  };

  return {
    props: {
      siteMeta: meta,
    },
  };
}
