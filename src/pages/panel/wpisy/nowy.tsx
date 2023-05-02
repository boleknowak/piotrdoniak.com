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
  useToast,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { currentTime } from '@/lib/currentTime';
import { formatDistance } from '@/lib/helpers';
import { useRouter } from 'next/router';

export default function PanelPostsCreate() {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [publishAt, setPublishAt] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { data: session, status: authed } = useSession();
  const toast = useToast();
  const router = useRouter();

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
    setIsCreating(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('categoryId', category);
    formData.append('content', content);
    formData.append('readingTime', readingTime);
    formData.append('publishAt', currentTime(publishAt).toISOString());

    const response = await fetch('/api/posts/manage', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    });

    const data = await response.json();

    setIsCreating(false);
    toast({
      title: data.message,
      description: data.error_message || null,
      status: data.success ? 'success' : 'error',
      duration: data.success ? 3000 : 9000,
      isClosable: true,
    });

    if (data.success) {
      setTitle('');
      setSlug('');
      setDescription('');
      setCategory('');
      setContent('');
      setPublishAt('');

      router.push('/panel/wpisy');
    }
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
          <div className="flex flex-row items-center space-x-3">
            <div>
              <Link
                as={NextLink}
                href="/panel/wpisy"
                className="block rounded px-1.5 py-4 hover:bg-gray-200"
              >
                <FaArrowLeft />
              </Link>
            </div>
            <div>
              <h1 className="text-xl font-bold">Nowy wpis</h1>
              <div>O czym dzisiaj napiszesz, {user?.firstName}?</div>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <Button isLoading={isCreating} colorScheme="green" onClick={handleCreatePost}>
              Stwórz post
            </Button>
          </div>
        </div>
        <div className="mt-6 space-y-4">
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
          <FormControl isRequired>
            <FormLabel>Krótki opis</FormLabel>
            <Input
              type="text"
              name="description"
              id="description"
              placeholder="Opisz wpis w kilku słowach"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
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
            <FormControl isRequired>
              <FormLabel>Czas czytania</FormLabel>
              <Input
                type="number"
                name="readingTime"
                id="readingTime"
                placeholder="np. 5"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
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
