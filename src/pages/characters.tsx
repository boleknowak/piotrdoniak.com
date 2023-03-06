import Head from 'next/head';
import Link from 'next/link';
import Characters from '@/components/Characters';
import { useFetch } from '@/hooks/useFetch';
import absoluteUrl from 'next-absolute-url';

export default function Post({ serverData }) {
  const { data: clientData, loading, error } = useFetch('/api/characters');

  if (error) return <div>An error occured.</div>;

  return (
    <>
      <Head>
        <title>Characters - Piotr Doniak</title>
        <meta name="description" content={`First character: ${serverData?.data.results[0].name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-w-xl">
        <div className="mt-10 mb-10 w-full px-4">
          <div>
            <Link href="/">
              <div className="text-blue-500">Go to home</div>
            </Link>
            <h1 className="mb-4 text-4xl font-bold">Characters</h1>
            {loading && <div>loading</div>}
            {!loading && <Characters data={clientData?.data} />}
            <hr />
            <Characters data={serverData?.data} />
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { origin } = absoluteUrl(context.req);
  const serverData = await fetch(`${origin}/api/characters`).then((res) => res.json());

  return {
    props: {
      serverData,
    },
  };
}
