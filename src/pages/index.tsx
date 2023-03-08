import { useFetch } from '@/hooks/useFetch';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import * as gtag from '@/lib/gtag';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
// import Image from 'next/image';
// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data, loading, error } = useFetch('/api/posts');
  const [useGoogleAnalytics, setUseGoogleAnalytics] = useLocalStorage(
    'useGoogleAnalytics',
    'accepted'
  );
  const { data: session, status } = useSession();
  const userEmail = session?.user.email;

  useEffect(() => {
    gtag.manageConsent(useGoogleAnalytics);
  }, [useGoogleAnalytics]);

  if (error) return <div>An error occured.</div>;
  if (loading) return <div>Loading ...</div>;

  const toggleUseGoogleAnalytics = (event) => {
    if (event.target.checked) {
      setUseGoogleAnalytics('accepted');
    } else {
      setUseGoogleAnalytics('rejected');
    }
  };

  const getGoogleAnalyticsStatus = () => useGoogleAnalytics;

  return (
    <>
      <Head>
        <title>Piotr Doniak</title>
        <meta name="description" content="Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="h-screen w-screen">
        <div className="flex h-full items-center justify-center">
          <div>
            <h1 className="mb-4 text-4xl font-bold">Hello World!</h1>
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
                    <li key={post.id} className="rounded bg-gray-200 p-4">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm italic">{post.content}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
