import Layout from '@/components/Layouts/Layout';
import { useEffect, useState } from 'react';
import SeoTags from '@/components/SeoTags';
import { PostInterface } from '@/interfaces/PostInterface';
import { CategoryInterface } from '@/interfaces/CategoryInterface';
import { Divider, Spinner } from '@chakra-ui/react';
import absoluteUrl from 'next-absolute-url';
import { useRouter } from 'next/router';
import PostItem from '@/components/Elements/PostItem';

interface Props {
  siteMeta: {
    title: string;
    description: string;
    url: string;
  };
  category: CategoryInterface;
}

export default function BlogPostsList({ siteMeta, category }: Props) {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchPosts = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/posts?category=${category.id}`);
    const data = await response.json();

    setPosts(data.posts);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [router]);

  return (
    <>
      <SeoTags title={siteMeta?.title} description={siteMeta?.description} url={siteMeta?.url} />
      <Layout>
        <div className="mb-20 flex h-full w-full items-start justify-center pt-6 md:pt-12">
          <div>
            <div className="w-full max-w-2xl text-[#212121]">
              <div className="text-xs font-medium uppercase text-gray-600">Kącik wiedzy</div>
              <h1 className="mb-4 text-3xl font-bold">{category.name}</h1>
              <div>
                <p>{category.description}</p>
              </div>
              <Divider my={6} />
              <div>
                {isLoading && (
                  <div className="mx-auto">
                    {/* TODO: skeleton */}
                    <Spinner />
                  </div>
                )}
                {!isLoading && posts.length === 0 && (
                  <div className="text-center text-sm text-gray-600">
                    Uuups! Nie ma tu nic, ale postaram się wrzucić coś ciekawego już niedługo!
                  </div>
                )}
                {!isLoading && posts.length > 0 && (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostItem key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async ({ req, query }) => {
  const { origin } = absoluteUrl(req);
  const response = await fetch(`${origin}/api/categories?id=${query.slug}`);
  const data = await response.json();
  const { category } = data;

  if (!category) return { notFound: true };

  const meta = {
    title: `${category.name} - Piotr Doniak`,
    description: category.description,
    url: `https://piotrdoniak.com/wiedza/${category.slug}`,
  };

  return {
    props: {
      siteMeta: meta,
      category,
    },
  };
};
