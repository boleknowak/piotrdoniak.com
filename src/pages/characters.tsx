import Head from 'next/head';
import Link from 'next/link';
import Characters from '@/components/Characters';
import { useFetch } from '@/hooks/useFetch';
import absoluteUrl from 'next-absolute-url';
// import { authOptions } from '@/pages/api/auth/[...nextauth]';
// import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Post({ serverData }) {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const { data: clientData, loading, error } = useFetch('/api/characters');
  const { data: session } = useSession();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (loading) return <div>Loading ...</div>;
  if (error) return <div>An error occured.</div>;
  // if (!session) return <div>Not logged in.</div>;
  if (serverData?.error) return <div>An error occured: {serverData?.error}</div>;

  return (
    <>
      <Head>
        <title>Characters - Piotr Doniak</title>
        <meta name="description" content={`First character: ${serverData?.data.results[0].name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="mx-auto max-w-xl">
        <div className="mt-10 mb-10 w-full px-4">
          {isLoadingPage && <div>Loading page...</div>}
          {!isLoadingPage && (
            <div>
              <Link href="/">
                <div className="text-blue-500">Go to home</div>
              </Link>
              <div className="mb-4">
                <h1 className="text-4xl font-bold">Characters</h1>
                <div>{session?.user?.email}</div>
              </div>
              {loading && <div>loading</div>}
              {!loading && <Characters data={clientData?.data} />}
              <hr />
              <Characters data={serverData?.data} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  // const session = await getServerSession(context.req, context.res, authOptions);

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   };
  // }

  const { origin } = absoluteUrl(context.req);
  const serverData = await fetch(`${origin}/api/characters`, {
    headers: {
      cookie: context.req.headers.cookie || '',
    },
  }).then((res) => res.json());

  return {
    props: {
      serverData,
    },
  };
}
