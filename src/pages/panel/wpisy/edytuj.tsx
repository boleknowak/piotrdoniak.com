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
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
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
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function PanelPostsUpdate({ post }) {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [content, setContent] = useState('');
  const [publishAt, setPublishAt] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lockChangeFeaturedImage, setLockChangeFeaturedImage] = useState(false);
  const [lockChangeOgImage, setLockChangeOgImage] = useState(false);
  const [lastFeaturedImageId, setLastFeaturedImageId] = useState('');
  const [lastOgImageId, setLastOgImageId] = useState('');
  const [featuredImageTitle, setFeaturedImageTitle] = useState('');
  const [ogImageTitle, setOgImageTitle] = useState('');
  const [removeImageType, setRemoveImageType] = useState('');
  const {
    isOpen: isConfirmRemoveImageDialogOpened,
    onOpen: openConfirmRemoveImageDialog,
    onClose: closeConfirmRemoveImageDialog,
  } = useDisclosure();
  const {
    isOpen: isConfirmDialogOpened,
    onOpen: openConfirmDialog,
    onClose: closeConfirmDialog,
  } = useDisclosure();
  const cancelRef = useRef();
  const filepondFeaturedImageRef = useRef<FilePond>();
  const filepondOgImageRef = useRef<FilePond>();
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
    setReadingTime(post.readingTime);
    setCategory(post.categoryId);
    setContent(post.content);

    const time = currentTime(post.publishedAt);
    time.setHours(time.getHours() + 2);
    setPublishAt(time.toISOString().slice(0, 16));
  };

  const handleUpdatePost = async () => {
    setIsUpdating(true);

    const featuredImage = filepondFeaturedImageRef.current.getFile();
    const ogImage = filepondOgImageRef.current.getFile();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('categoryId', category);
    formData.append('content', content);
    formData.append('readingTime', readingTime);
    formData.append('publishAt', currentTime(publishAt).toISOString());
    formData.append('featuredImageTitle', featuredImageTitle);
    formData.append('ogImageTitle', ogImageTitle);
    if (featuredImage) {
      formData.append('featuredImage', featuredImage.file);
    }
    if (ogImage) {
      formData.append('ogImage', ogImage.file);
    }
    formData.append('lockChangeFeaturedImage', lockChangeFeaturedImage.toString());
    formData.append('lockChangeOgImage', lockChangeOgImage.toString());

    const response = await fetch(`/api/posts/manage?id=${post.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
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

    const response = await fetch(`/api/posts/manage?id=${post.id}`, {
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

  const removeImageConfirm = async (name: string) => {
    setRemoveImageType(name);
    openConfirmRemoveImageDialog();
  };

  const removeImage = async (name: string) => {
    setIsDeleting(true);
    const response = await fetch(`/api/posts/manage?id=${post.id}&removeImage=${name}`, {
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
      closeConfirmRemoveImageDialog();
      if (name === 'featuredImage') {
        filepondFeaturedImageRef.current.removeFile();
      } else if (name === 'ogImage') {
        filepondOgImageRef.current.removeFile();
      }
    }
  };

  const handleFeaturedImageUploaderInit = () => {
    if (post.featuredImage?.url) {
      filepondFeaturedImageRef.current.addFile(post.featuredImage.url);
      if (filepondFeaturedImageRef.current.getFile()) {
        setLockChangeFeaturedImage(true);
        setFeaturedImageTitle(post.featuredImage.title || '');
      }
    }
  };

  const handleOgImageUploaderInit = () => {
    if (post.ogImage?.url) {
      filepondOgImageRef.current.addFile(post.ogImage.url);
      if (filepondOgImageRef.current.getFile()) {
        setLockChangeOgImage(true);
        setOgImageTitle(post.ogImage.title || '');
      }
    }
  };

  const handleFeaturedImageUpdate = (file) => {
    if (!file?.id) {
      setLockChangeFeaturedImage(false);
    } else if (!post.featuredImage?.url) {
      setLockChangeFeaturedImage(false);
    } else if (lastFeaturedImageId === '') {
      setLockChangeFeaturedImage(true);
    } else if (file?.id === lastFeaturedImageId) {
      setLockChangeFeaturedImage(true);
    } else {
      setLockChangeFeaturedImage(false);
    }

    setLastFeaturedImageId(file?.id);
  };

  const handleOgImageUpdate = (file) => {
    if (!file?.id) {
      setLockChangeOgImage(false);
    } else if (!post.ogImage?.url) {
      setLockChangeOgImage(false);
    } else if (lastOgImageId === '') {
      setLockChangeOgImage(true);
    } else if (file?.id === lastOgImageId) {
      setLockChangeOgImage(true);
    } else {
      setLockChangeOgImage(false);
    }

    setLastOgImageId(file?.id);
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
            <EditorComponent onUpdate={(c) => setContent(c)} initValue={post.content} />
          </div>
          <div className="pt-6">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading as="h3" size="md">
                Wgraj obrazki do posta
              </Heading>
              <Button isLoading={isUpdating} colorScheme="green" onClick={() => handleUpdatePost()}>
                Zapisz zmiany
              </Button>
            </Flex>
            <Divider my={4} />
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              <GridItem p={4}>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">Góra posta</Heading>
                  <div>
                    <Button
                      variant="outline"
                      colorScheme="red"
                      size="xs"
                      onClick={() => removeImageConfirm('featuredImage')}
                    >
                      Usuń
                    </Button>
                  </div>
                </Flex>
                <FormControl isRequired mb={4}>
                  <FormLabel>Tytuł obrazka</FormLabel>
                  <Input
                    type="text"
                    name="featuredImageTitle"
                    id="featuredImageTitle"
                    placeholder="Piękne góry w tle"
                    value={featuredImageTitle}
                    onChange={(e) => setFeaturedImageTitle(e.target.value)}
                  />
                </FormControl>
                <FilePond
                  oninit={() => handleFeaturedImageUploaderInit()}
                  onaddfile={(error, file) => handleFeaturedImageUpdate(file)}
                  ref={filepondFeaturedImageRef}
                  name="featuredImage"
                  allowPaste={false}
                  dropOnPage={true}
                  labelIdle='Przeciągnij i upuść lub <span class="filepond--label-action">wyszukaj</span>'
                  labelFileWaitingForSize="Kalkulowanie rozmiaru"
                  labelFileLoading="Wczytywanie"
                />
              </GridItem>
              <GridItem p={4}>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">Open Graph</Heading>
                  <div>
                    <Button
                      variant="outline"
                      colorScheme="red"
                      size="xs"
                      onClick={() => removeImageConfirm('ogImage')}
                    >
                      Usuń
                    </Button>
                  </div>
                </Flex>
                <FormControl isRequired mb={4}>
                  <FormLabel>Tytuł obrazka</FormLabel>
                  <Input
                    type="text"
                    name="ogImageTitle"
                    id="ogImageTitle"
                    placeholder="Piękne góry w tle"
                    value={ogImageTitle}
                    onChange={(e) => setOgImageTitle(e.target.value)}
                  />
                </FormControl>
                <FilePond
                  oninit={() => handleOgImageUploaderInit()}
                  onaddfile={(error, file) => handleOgImageUpdate(file)}
                  ref={filepondOgImageRef}
                  name="ogImage"
                  allowPaste={false}
                  dropOnPage={true}
                  labelIdle='Przeciągnij i upuść lub <span class="filepond--label-action">wyszukaj</span>'
                  labelFileWaitingForSize="Kalkulowanie rozmiaru"
                  labelFileLoading="Wczytywanie"
                />
              </GridItem>
            </Grid>
          </div>
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
        <AlertDialog
          isOpen={isConfirmRemoveImageDialogOpened}
          leastDestructiveRef={cancelRef}
          onClose={closeConfirmRemoveImageDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Potwierdź usunięcie obrazka
              </AlertDialogHeader>
              <AlertDialogBody>
                Jesteś pewien, że chcesz usunąć ten obrazek? Tej operacji{' '}
                <span className="font-bold underline">nie</span> można cofnąć!
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeConfirmRemoveImageDialog}>
                  Anuluj
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => removeImage(removeImageType)}
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
  const { posts } = await fetch(`${origin}/api/posts/manage?id=${query.id}`, {
    headers: {
      cookie: req.headers.cookie || '',
    },
  }).then((res) => res.json());

  if (!posts) return { notFound: true };

  return {
    props: {
      post: posts[0],
    },
  };
}
