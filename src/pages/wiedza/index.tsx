import Layout from '@/components/Layouts/Layout';
// import { useState } from 'react';
import SeoTags from '@/components/SeoTags';
// import { CategoryInterface } from '@/interfaces/CategoryInterface';
// import { PostInterface } from '@/interfaces/PostInterface';

export default function BlogPageMarketing({ siteMeta }) {
  // const [categories, setCategories] = useState<CategoryInterface[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [post, setPost] = useState<PostInterface>(null);

  return (
    <>
      <SeoTags title={siteMeta?.title} description={siteMeta?.description} url={siteMeta?.url} />
      <Layout>
        <div className="mb-20 mt-6 flex h-full w-full items-center justify-center md:mt-0">
          <div>
            <div className="w-full max-w-2xl text-[#43403C]">
              <h1 className="mb-4 text-2xl font-bold">O czym chcesz przeczytać?</h1>
              <div>
                <p>Czasem napiszę jakiś wpis. Wybierz z jakiej kategorii chcesz przeczytać.</p>
                <p>lub zobacz ostatni wpis:</p>
              </div>
              <div className="mt-10">lista</div>
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
    description: `Czasem piszę o marketingu, sprawdź co ostatnio napisałem.`,
    url: 'https://piotrdoniak.com/marketing',
  };

  return {
    props: {
      siteMeta: meta,
    },
  };
};
