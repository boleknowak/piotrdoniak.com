import Head from 'next/head';

export default function Test({ siteMeta, post }) {
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
        <h1>Test #{post.id}</h1>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const meta = {
    title: 'this is my website title',
    description: 'this is my website description',
  };

  const post = {
    id: 1,
  };

  return {
    props: {
      siteMeta: meta,
      post,
    },
  };
}
