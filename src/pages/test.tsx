import Head from 'next/head';

export default function Test({ title }) {
  return (
    <>
      <Head>
        <title>Test - {title}</title>
        <meta
          name="description"
          content="Add a shopping cart to your site in minutes. Works with any site builder, CMS, and framework. 20 000+ merchants trust our e-commerce solution for their website. Join them!"
        />
        <meta
          property="og:title"
          content="Add a Shopping Cart to Any Website in Minutes - Snipcart"
        />
        <meta
          property="og:description"
          content="Add a shopping cart to your site in minutes. Works with any site builder, CMS, and framework. 20 000+ merchants trust our e-commerce solution for their website. Join them!"
        />
        <meta property="og:url" content="https://snipcart.com/" />
        <meta property="og:type" content="website" />
      </Head>
      <main>
        <h1>Test</h1>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const title = 'Test';

  return {
    props: {
      title: `Product ${title}`,
    },
  };
}
