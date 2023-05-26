import Layout from '@/components/Layouts/Layout';
import { useEffect, useState } from 'react';
import SeoTags from '@/components/SeoTags';
import { PostInterface } from '@/interfaces/PostInterface';
import { CategoryInterface } from '@/interfaces/CategoryInterface';
import { Divider, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import PostItem from '@/components/Elements/PostItem';

interface Props {
  siteMeta: {
    title: string;
    description: string;
    url: string;
  };
  category_meta: CategoryInterface;
}

export default function BlogPostsList({ siteMeta, category_meta }: Props) {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [category, setCategory] = useState<CategoryInterface>({} as CategoryInterface);
  const [modifiedSiteMeta, setSiteMeta] = useState<Props['siteMeta']>(siteMeta);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchPosts = async (id) => {
    setIsLoading(true);
    const response = await fetch(`/api/posts?category=${id}`);
    const data = await response.json();

    setPosts(data.posts);
    setIsLoading(false);
  };

  const fetchCategory = async () => {
    setIsLoading(true);

    const response = await fetch(`/api/categories?id=${router.query.slug}`);
    const data = await response.json();

    setCategory(data.category);

    const meta = {
      title: `${data.category.name} - Piotr Doniak`,
      description: data.category.description,
      url: `https://piotrdoniak.com/wiedza/${data.category.slug}`,
    };

    setSiteMeta(meta);
    fetchPosts(data.category.id);
  };

  useEffect(() => {
    if (typeof category.id === 'undefined') {
      setCategory(category_meta);
    }

    fetchCategory();
  }, [router]);

  return (
    <>
      <SeoTags
        title={modifiedSiteMeta.title || siteMeta.title}
        description={modifiedSiteMeta.description || siteMeta.description}
        url={modifiedSiteMeta.url || siteMeta.url}
      />
      <Layout>
        <div className="mb-20 flex h-full w-full items-start justify-center pt-6 md:pt-12">
          <div className="animate__animated animate__fadeIn w-full max-w-2xl">
            <div className="text-[#212121]">
              <div className="text-xs font-medium uppercase text-gray-600">Kącik wiedzy</div>
              <h1 className="mb-4 text-3xl font-bold">{category?.name}</h1>
              <div>
                <p>{category?.description}</p>
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

export async function getStaticProps({ params }) {
  const { slug } = params;
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  const { category } = await fetch(`${origin}/api/categories?id=${slug}`).then((res) => res.json());

  if (!category) return { notFound: true };

  const meta = {
    title: `${category.name} - Piotr Doniak`,
    description: category.description,
    url: `https://piotrdoniak.com/wiedza/${category.slug}`,
  };

  return {
    props: {
      category_meta: category,
      siteMeta: meta,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  const { categories } = await fetch(`${origin}/api/categories`).then((res) => res.json());
  const paths = categories.map((category: CategoryInterface) => ({
    params: { slug: category.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}
