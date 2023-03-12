import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pl">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff9000" />
        <meta name="msapplication-TileColor" content="#ff9000" />
        <meta name="theme-color" content="#ff9000" />
      </Head>
      <body className="bg-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
