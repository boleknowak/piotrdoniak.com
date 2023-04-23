import CategoryItem from '@/components/Elements/CategoryItem';
import PostItem from '@/components/Elements/PostItem';
import Layout from '@/components/Layouts/Layout';
import SeoTags from '@/components/SeoTags';
import { PostInterface } from '@/interfaces/PostInterface';
import { useEffect, useState } from 'react';
import { CategoryInterface } from '@/interfaces/CategoryInterface';

export default function BlogPageMarketing({ siteMeta }) {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<PostInterface>(null);

  const fetchPost = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/posts/last`);
    const data = await response.json();

    setPost(data.post);
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/categories`);
    const data = await response.json();

    setCategories(data.categories);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchPost();
  }, []);

  return (
    <>
      <SeoTags title={siteMeta?.title} description={siteMeta?.description} url={siteMeta?.url} />
      <Layout>
        <div className="mb-20 flex h-full w-full items-start justify-center pt-6 md:pt-12">
          <div>
            <div className="w-full max-w-2xl text-[#212121]">
              <h1 className="mb-4 text-2xl font-bold">O czym chcesz przeczytać?</h1>
              <div>
                <p>
                  To idealne miejsce do poszerzania swojej wiedzy z różnych dziedzin i odkrywania
                  nowych, inspirujących treści. Wybierz kategorię, którą Cię interesuje i zacznij
                  czytać. ☕️
                </p>
              </div>
              <div className="mt-10">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {categories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <div className="mb-2 font-bold">Mój ostatni post 👀</div>
                {!isLoading && post?.id && <PostItem post={post} />}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async () => {
  const meta = {
    title: 'Wiedza - Piotr Doniak',
    description:
      'To idealne miejsce do poszerzania swojej wiedzy z różnych dziedzin i odkrywania nowych, inspirujących treści.',
    url: 'https://piotrdoniak.com/wiedza',
  };

  return {
    props: {
      siteMeta: meta,
    },
  };
};
