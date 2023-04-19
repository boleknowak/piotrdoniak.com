import absoluteUrl from 'next-absolute-url';
import DateComponent from '@/components/Date';
import SeoTags from '@/components/SeoTags';
import Layout from '@/components/Layouts/Layout';

export default function Post({ siteMeta, post }) {
  return (
    <>
      <SeoTags title={siteMeta?.title} description={siteMeta?.description} url={siteMeta?.url} />
      <Layout>
        <div className="mb-20 flex h-full w-full items-start pt-4 md:pt-10">
          <div className="mx-auto w-full max-w-2xl">
            <div>
              <h1 className="text-2xl font-bold">{post.title}</h1>
              <div>
                <DateComponent dateString={post.publishedAt} />
              </div>
              <div>{post.views}</div>
            </div>
            <div className="mt-4 w-full max-w-2xl text-left text-[#43403C]">{post.content}</div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, params }) {
  const { origin } = absoluteUrl(req);
  const { post } = await fetch(`${origin}/api/posts/${params.slug}`, {
    headers: {
      cookie: req.headers.cookie || '',
    },
  }).then((res) => res.json());

  if (!post) return { notFound: true };

  const meta = {
    title: `${post.title} - Piotr Doniak`,
    description: `${post.content.slice(0, 100)}...`,
    url: `${origin}/post/${post.slug}`,
  };

  return {
    props: {
      siteMeta: meta,
      post,
    },
  };
}
