import '@/styles/globals.css';
import dynamic from 'next/dynamic';
import 'nprogress/nprogress.css';

const TopProgressBar = dynamic(() => import('@/components/TopProgressBar'), { ssr: false });

export default function App({ Component, pageProps }) {
  return (
    <>
      <TopProgressBar />
      <Component {...pageProps} />
    </>
  );
}
