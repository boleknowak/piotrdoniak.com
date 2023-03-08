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
  const post = {
    id: 1,
  };

  const meta = {
    title: `this is my #${post.id} test title`,
    description: `this is my #${post.id} test description`,
  };

  return {
    props: {
      siteMeta: meta,
      post,
    },
  };
}
