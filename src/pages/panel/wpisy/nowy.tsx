import EditorComponent from '@/components/Elements/EditorComponent';
import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { CategoryInterface } from '@/interfaces/CategoryInterface';
import { UserInterface } from '@/interfaces/UserInterface';
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Link,
  Select,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { currentTime } from '@/lib/currentTime';
import { formatDistance } from '@/lib/helpers';

export default function PanelPostsCreate() {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [publishAt, setPublishAt] = useState('');
  const { data: session, status: authed } = useSession();

  const fetchCategories = async () => {
    const response = await fetch('/api/categories', {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    setCategories(data.categories);
  };

  const handleCreatePost = async () => {
    console.log({
      title,
      slug,
      category,
      content,
      publishAt: currentTime(publishAt).getTime(),
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (authed === 'loading') return <LoadingPage />;
  const user = session?.user as UserInterface;

  return (
    <>
      <Head>
        <title>Nowy wpis - Panel - Piotr Doniak</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PanelLayout>
        <div className="flex flex-row items-center justify-between rounded-lg bg-gray-100 p-4">
          <div>
            <h1 className="text-xl font-bold">Nowy wpis</h1>
            <div>O czym dzisiaj napiszesz, {user?.firstName}?</div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <Link as={NextLink} href="/panel/wpisy">
              <Button leftIcon={<FaArrowLeft />} colorScheme="yellow">
                Lista wpisów
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <Button colorScheme="green" onClick={handleCreatePost}>
            Zapisz
          </Button>
          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Tytuł</FormLabel>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="np. 7 najciekawszych kreacji 2023"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Slug (do url)</FormLabel>
              <Input
                type="text"
                name="slug"
                id="slug"
                placeholder="np. 7-najciekawszych-kreacji-2023"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </FormControl>
          </HStack>
          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Kategoria</FormLabel>
              <Select placeholder="Wybierz kategorię" onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <Flex justify="space-between">
                <FormLabel>Data publikacji</FormLabel>
                <FormHelperText>{publishAt && formatDistance(publishAt)}</FormHelperText>
              </Flex>
              <Input
                type="datetime-local"
                value={publishAt}
                onChange={(e) => {
                  let time = e.target.value;
                  time = time.replace('T', ' ');
                  time = time.replace('Z', '');
                  setPublishAt(time);
                }}
              />
            </FormControl>
          </HStack>
          <div>
            <EditorComponent onUpdate={(c) => setContent(c)} />
          </div>
        </div>
      </PanelLayout>
    </>
  );
}
