import ManageCategoriesModal from '@/components/Elements/Modals/ManageCategoriesModal';
import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { CategoryInterface } from '@/interfaces/CategoryInterface';
import { PostInterface } from '@/interfaces/PostInterface';
import { UserInterface } from '@/interfaces/UserInterface';
import { Button, IconButton, useDisclosure } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GrRefresh } from 'react-icons/gr';

export default function PanelPosts() {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: session, status: authed } = useSession();
  const {
    isOpen: isCategoriesModalOpened,
    onOpen: openCategoriesModal,
    onClose: closeCategoriesModal,
  } = useDisclosure();

  const fetchPosts = async () => {
    const response = await fetch('/api/posts', {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    setPosts(data.posts);
  };

  const fetchCategories = async () => {
    const response = await fetch('/api/categories', {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    setCategories(data.categories);
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchPosts();
    await fetchCategories();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  if (authed === 'loading') return <LoadingPage />;
  const user = session?.user as UserInterface;

  return (
    <>
      <Head>
        <title>Wpisy - Panel - Piotr Doniak</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PanelLayout>
        <div className="flex flex-row items-center justify-between rounded-lg bg-gray-100 p-4">
          <div>
            <h1 className="text-xl font-bold">Wpisy na blogu</h1>
            <div>Zarządzaj wpisami, {user?.firstName}</div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <IconButton
              aria-label="Refresh"
              icon={<GrRefresh />}
              colorScheme="yellow"
              variant="ghost"
              isLoading={isRefreshing}
              onClick={() => refreshData()}
            />
            <Button colorScheme="yellow" variant="ghost" onClick={openCategoriesModal}>
              Kategorie
            </Button>
            <Button colorScheme="yellow">Stwórz post</Button>
          </div>
        </div>
        <div className="mt-6">
          {posts.length === 0 && <div>Nie ma postów.</div>}
          {posts.length > 0 && (
            <div>
              {posts.map((post) => (
                <div key={post.id}>{JSON.stringify(post)}</div>
              ))}
            </div>
          )}
        </div>
        <ManageCategoriesModal
          isOpen={isCategoriesModalOpened}
          onClose={closeCategoriesModal}
          categories={categories}
          setCategories={setCategories}
        />
      </PanelLayout>
    </>
  );
}
