import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: 'Piotr Doniak',
    url: 'http://piotrdoniak.com/',
    image: 'https://piotrdoniak.com/images/brand/me.png',
    sameAs: ['https://www.linkedin.com/in/piotrdoniak/', 'https://www.instagram.com/piotrdoniak/'],
  };

  return (
    <Html lang="pl">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#FEFCE8" />
        <meta name="msapplication-TileColor" content="#FEFCE8" />
        <meta name="theme-color" content="#FEFCE8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <body className="bg-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
