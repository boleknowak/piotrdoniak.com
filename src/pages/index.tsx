// import { useFetch } from '@/hooks/useFetch';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import * as gtag from '@/lib/gtag';
import Head from 'next/head';
// import Link from 'next/link';
import { useEffect } from 'react';
// import { useSession, signIn, signOut } from 'next-auth/react';
import Layout from '@/components/Layout';
import { Sofia } from 'next/font/google';
import Image from 'next/image';

const sofia = Sofia({ subsets: ['latin'], weight: '400' });

export default function Home({ siteMeta }) {
  // const { data, loading, error } = useFetch('/api/posts');
  const [useGoogleAnalytics /* , setUseGoogleAnalytics */] = useLocalStorage(
    'useGoogleAnalytics',
    'accepted'
  );
  // const { data: session, status } = useSession();
  // const userEmail = session?.user.email;

  useEffect(() => {
    gtag.manageConsent(useGoogleAnalytics);
  }, [useGoogleAnalytics]);

  // if (error) return <div>An error occured.</div>;

  // const toggleUseGoogleAnalytics = (event) => {
  //   if (event.target.checked) {
  //     setUseGoogleAnalytics('accepted');
  //   } else {
  //     setUseGoogleAnalytics('rejected');
  //   }
  // };

  // const getGoogleAnalyticsStatus = () => useGoogleAnalytics;

  return (
    <>
      <Head>
        <title>{siteMeta?.title}</title>
        <meta name="description" content={siteMeta?.description} />
        <meta property="og:title" content={siteMeta?.title} />
        <meta property="og:description" content={siteMeta?.description} />
        <meta property="og:image" content={siteMeta?.image} />
        <meta property="og:url" content={siteMeta?.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta property="twitter:domain" content="piotrdoniak.com" />
        <meta property="twitter:url" content={siteMeta?.url} />
        <meta name="twitter:title" content={siteMeta?.title} />
        <meta name="twitter:description" content={siteMeta?.description} />
        <meta name="twitter:image" content={siteMeta?.image} />
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
              <h1 className="mb-4 text-2xl font-bold">Cze????!</h1>
              <div className="space-y-4 leading-6 tracking-wide">
                <p>
                  To ja, Piotrek ??? student e-marketingu. Swoj?? przygod?? zacz????em od programowania,
                  <br />a obecnie zale??y mi na{' '}
                  <span className="underline decoration-dotted underline-offset-4" title="Pozna??">
                    POZ
                  </span>
                  naniu si?? ze ??wiatem marketingu.
                </p>
                <p>
                  Zdobywanie wiedzy uwa??am za mo??liwo???? rozwoju, a dzi??ki temu coraz szybciej i
                  lepiej wykonuj?? zadania.
                </p>
                <p>
                  Zapraszam Ci?? do zapoznania si?? z moimi projektami oraz wpisami na blogu
                  {` `}
                  <span className={sofia.className}>:)</span>
                </p>
              </div>
            </div>
            {/* {loading && false && <div>Loading ...</div>}
            {!loading && false && (
              <div>
                <Link href="/characters">
                  <div className="text-blue-500">Go to characters</div>
                </Link>
                <div className="mt-4">
                  <label htmlFor="useGoogleAnalytics" className="mr-2">
                    Use Google Analytics ({getGoogleAnalyticsStatus()})
                  </label>
                  <input
                    type="checkbox"
                    id="useGoogleAnalytics"
                    checked={useGoogleAnalytics === 'accepted'}
                    onChange={toggleUseGoogleAnalytics}
                  />
                </div>
                <div>
                  {status === 'unauthenticated' && (
                    <button onClick={() => signIn('google')}>Sign in</button>
                  )}
                  {status === 'authenticated' && (
                    <div>
                      <p>Signed in as {userEmail}</p>
                      <button onClick={() => signOut()}>Sign out</button>
                    </div>
                  )}
                </div>
                <div>
                  {data?.posts.length !== 0 && (
                    <ul className="space-y-4">
                      {data?.posts.map((post) => (
                        <Link href={`/post/${post.id}`} key={post.id}>
                          <li key={post.id} className="rounded bg-gray-200 p-4">
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm italic">{post.content}</div>
                          </li>
                        </Link>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async () => {
  const meta = {
    title: 'Piotr Doniak',
    description: `Jestem Piotr i lubi?? marketing oraz programowanie. Sprawd?? moje projekty i bloga, aby dowiedzie?? si?? o mnie wi??cej.`,
    image: 'https://piotrdoniak.com/images/brand/me.png',
    url: 'https://piotrdoniak.com',
  };

  return {
    props: {
      siteMeta: meta,
    },
  };
};
