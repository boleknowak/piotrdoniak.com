import Layout from '@/components/Layout';
import Head from 'next/head';
import Image from 'next/image';

export default function Count({ siteMeta, data }) {
  return (
    <>
      <Head>
        <title>{siteMeta?.title}</title>
        <meta name="description" content={siteMeta?.description} />
        <meta property="og:title" content={siteMeta?.title} />
        <meta property="og:description" content={siteMeta?.description} />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="flex h-full w-full items-center justify-center">
          <div>
            <div className="w-full max-w-2xl text-[#43403C]">
              <Image
                src="/images/homepage.png"
                alt="Hero"
                width={600}
                height={286}
                className="mb-10 rounded-lg"
              />
              <h1 className="mb-4 text-2xl font-bold">{data.count}</h1>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const post = {
    id: 1,
  };

  const data = {
    count: Math.random() * 100,
  };

  const meta = {
    title: `Count - ${post.id} - Piotr Doniak`,
    description: `Opis dla posta ${post.id} z liczbą ${data.count}`,
  };

  return {
    props: {
      siteMeta: meta,
      data,
    },
  };
}
