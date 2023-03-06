import '@/styles/globals.css';
import dynamic from 'next/dynamic';
import 'nprogress/nprogress.css';
import Script from 'next/script';
import * as gtag from '@/lib/gtag';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const TopProgressBar = dynamic(() => import('@/components/TopProgressBar'), { ssr: false });

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <TopProgressBar />
      <Component {...pageProps} />
    </>
  );
}
