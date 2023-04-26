import DateComponent from '@/components/Date';
import SeoTags from '@/components/SeoTags';
import Layout from '@/components/Layouts/Layout';
import { PostInterface } from '@/interfaces/PostInterface';
import { useEffect } from 'react';

interface Props {
  siteMeta: {
    title: string;
    description: string;
    url: string;
  };
  post: PostInterface;
}

export default function Post({ siteMeta, post }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    // mainEntityOfPage: {
    //   '@type': 'WebPage',
    //   '@id': 'https://piotrdoniak.com',
    // },
    headline: post.title,
    description: post.description,
    // image: '',
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `https://piotrdoniak.com/autorzy/${post.author.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Piotr Doniak',
      url: 'https://piotrdoniak.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://piotrdoniak.com/images/brand/me.png',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
  };

  const updateViews = async () => {
    await fetch(`/api/posts/views?slug=${post.slug}`, {
      method: 'POST',
    });
  };

  useEffect(() => {
    updateViews();
  }, []);

  return (
    <>
      <SeoTags
        title={siteMeta?.title}
        description={siteMeta?.description}
        url={siteMeta?.url}
        type="article"
        schema={schema}
      />
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
            <div className="mt-4 w-full max-w-2xl text-left text-[#212121]">
              <article className="prose prose-p:my-2 prose-p:leading-6 prose-img:rounded-md">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  const { post } = await fetch(`${origin}/api/posts/${slug}`).then((res) => res.json());

  if (!post) return { notFound: true };

  const meta = {
    title: `${post.title} - Piotr Doniak`,
    description: post.description,
    url: `${origin}/post/${post.slug}`,
  };

  return {
    props: {
      post,
      siteMeta: meta,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  const { posts } = await fetch(`${origin}/api/posts?all=1`).then((res) => res.json());
  const paths = posts.map((post: PostInterface) => ({ params: { slug: post.slug } }));

  return {
    paths,
    fallback: false,
  };
}
