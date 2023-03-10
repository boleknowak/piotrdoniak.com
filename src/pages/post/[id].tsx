import absoluteUrl from 'next-absolute-url';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Date from '@/components/Date';

export default function Post({ siteMeta, post }) {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>{siteMeta?.title}</title>
        <meta name="description" content={siteMeta?.content} />
        <meta property="og:title" content={siteMeta?.title} />
        <meta property="og:description" content={siteMeta?.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="mx-auto max-w-xl">
        <div className="mt-10 mb-10 w-full px-4">
          <div>
            <Link href="/">
              <div className="text-blue-500">Go to home</div>
            </Link>
            <div className="mb-4">
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <div>
                <div>{session?.user?.email}</div>
                <div>
                  <Date dateString={post.createdAt} />
                </div>
              </div>
            </div>
            <div>{post.content}</div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({ req, params }) {
  const { origin } = absoluteUrl(req);
  const { post } = await fetch(`${origin}/api/posts/${params.id}`, {
    headers: {
      cookie: req.headers.cookie || '',
    },
  }).then((res) => res.json());

  if (!post) return { notFound: true };

  const meta = {
    title: `${post.title} - Piotr Doniak`,
    description: `${post.content.slice(0, 100)}...`,
  };

  return {
    props: {
      siteMeta: meta,
      post,
    },
  };
}
