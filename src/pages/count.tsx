import Head from 'next/head';

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
      <main>
        <h1>Mam {data.count} czegoś...</h1>
      </main>
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
