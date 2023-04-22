import EditorComponent from '@/components/Elements/EditorComponent';
import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { CategoryInterface } from '@/interfaces/CategoryInterface';
import { UserInterface } from '@/interfaces/UserInterface';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Link,
  Select,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { FiEye, FiTrash } from 'react-icons/fi';
import { currentTime } from '@/lib/currentTime';
import { formatDistance } from '@/lib/helpers';
import absoluteUrl from 'next-absolute-url';
import { useRouter } from 'next/router';

export default function PanelPostsUpdate({ post }) {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [publishAt, setPublishAt] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    isOpen: isConfirmDialogOpened,
    onOpen: openConfirmDialog,
    onClose: closeConfirmDialog,
  } = useDisclosure();
  const cancelRef = useRef();
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
    setTitle(post.title);
    setSlug(post.slug);
    setDescription(post.description);
    setCategory(post.categoryId);
    setContent(post.content);

    const time = currentTime(post.publishedAt);
    time.setHours(time.getHours() + 2);
    setPublishAt(time.toISOString().slice(0, 16));
  };

  const handleUpdatePost = async () => {
    setIsUpdating(true);

    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        slug,
        description,
        categoryId: category,
        content,
        publishAt: currentTime(publishAt).getTime(),
      }),
    });

    const data = await response.json();

    setIsUpdating(false);
    toast({
      title: data.message,
      description: data.error_message || null,
      status: data.success ? 'success' : 'error',
      duration: data.success ? 3000 : 9000,
      isClosable: true,
    });
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);

    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    setIsDeleting(false);
    toast({
      title: data.message,
      description: data.error_message || null,
      status: data.success ? 'success' : 'error',
      duration: data.success ? 3000 : 9000,
      isClosable: true,
    });

    if (data.success) {
      closeConfirmDialog();
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
        <title>Edytuj wpis - Panel - Piotr Doniak</title>
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
              <h1 className="text-xl font-bold">Edytuj wpis #{post.id}</h1>
              <div>O czym dzisiaj napiszesz, {user?.firstName}?</div>
            </div>
          </div>
          <HStack spacing={2}>
            <Button isLoading={isUpdating} colorScheme="green" onClick={() => handleUpdatePost()}>
              Zapisz zmiany
            </Button>
            <Link as={NextLink} href={`/post/${post.slug}`} target="_blank">
              <IconButton
                aria-label="Podgląd wpisu"
                icon={<FiEye />}
                colorScheme="blue"
                variant="outline"
              />
            </Link>
            <IconButton
              aria-label="Usuń wpis"
              icon={<FiTrash />}
              colorScheme="red"
              variant="outline"
              isLoading={isDeleting}
              onClick={() => openConfirmDialog()}
            />
          </HStack>
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
              <Select
                placeholder="Wybierz kategorię"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
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
            <EditorComponent onUpdate={(c) => setContent(c)} initValue={post.content} />
          </div>
          {/* TODO: add large image (like on index page), add images for og etc. */}
        </div>
        <AlertDialog
          isOpen={isConfirmDialogOpened}
          leastDestructiveRef={cancelRef}
          onClose={closeConfirmDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Potwierdź usunięcie
              </AlertDialogHeader>
              <AlertDialogBody>
                Jesteś pewien, że chcesz usunąć ten wpis? Tej operacji{' '}
                <span className="font-bold underline">nie</span> można cofnąć!
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeConfirmDialog}>
                  Anuluj
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeletePost()}
                  isLoading={isDeleting}
                  ml={3}
                >
                  Usuń
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </PanelLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { origin } = absoluteUrl(req);
  const { post } = await fetch(`${origin}/api/posts/${query.id}`, {
    headers: {
      cookie: req.headers.cookie || '',
    },
  }).then((res) => res.json());

  if (!post) return { notFound: true };

  return {
    props: {
      post,
    },
  };
}
