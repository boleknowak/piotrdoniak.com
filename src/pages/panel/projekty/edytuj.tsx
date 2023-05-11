import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
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

export default function PanelProjectsUpdate({ project }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [publishAt, setPublishAt] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lockChangeLogo, setLockChangeLogo] = useState(false);
  const [lockChangeOgLogo, setLockChangeOgLogo] = useState(false);
  const [lastLogoId, setLastLogoId] = useState('');
  const [lastOgLogoId, setLastOgLogoId] = useState('');
  const {
    isOpen: isConfirmDialogOpened,
    onOpen: openConfirmDialog,
    onClose: closeConfirmDialog,
  } = useDisclosure();
  const cancelRef = useRef();
  const filepondLogoRef = useRef<FilePond>();
  const filepondOgLogoRef = useRef<FilePond>();
  const { data: session, status: authed } = useSession();
  const toast = useToast();
  const router = useRouter();

  const handleUpdateProject = async () => {
    setIsUpdating(true);

    const logoImage = filepondLogoRef.current.getFile();
    const ogLogoImage = filepondOgLogoRef.current.getFile();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('publishedAt', currentTime(publishAt).toISOString());
    if (logoImage) {
      formData.append('logoImage', logoImage.file);
    }
    if (ogLogoImage) {
      formData.append('ogImage', ogLogoImage.file);
    }
    formData.append('lockChangeLogo', lockChangeLogo.toString());
    formData.append('lockChangeOgImage', lockChangeOgLogo.toString());

    const response = await fetch(`/api/projects/manage?id=${project.id}`, {
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

  const handleDeleteProject = async () => {
    setIsDeleting(true);

    const response = await fetch(`/api/projects/manage?id=${project.id}`, {
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
      router.push('/panel/projekty');
    }
  };

  const handleLogoUploaderInit = () => {
    if (project.logoImage?.url) {
      filepondLogoRef.current.addFile(project.logoImage.url);
      if (filepondLogoRef.current.getFile()) {
        setLockChangeLogo(true);
      }
    }

    if (project.ogLogoImage?.url) {
      filepondOgLogoRef.current.addFile(project.ogLogoImage.url);
      if (filepondOgLogoRef.current.getFile()) {
        setLockChangeOgLogo(true);
      }
    }
  };

  const handleLogoUpdate = (file) => {
    if (!file?.id) {
      setLockChangeLogo(false);
    } else if (!project.logoImage?.url) {
      setLockChangeLogo(false);
    } else if (lastLogoId === '') {
      setLockChangeLogo(true);
    } else if (file?.id === lastLogoId) {
      setLockChangeLogo(true);
    } else {
      setLockChangeLogo(false);
    }

    setLastLogoId(file?.id);
  };

  const handleOgLogoUpdate = (file) => {
    if (!file?.id) {
      setLockChangeOgLogo(false);
    } else if (!project.ogLogoImage?.url) {
      setLockChangeOgLogo(false);
    } else if (lastOgLogoId === '') {
      setLockChangeOgLogo(true);
    } else if (file?.id === lastOgLogoId) {
      setLockChangeOgLogo(true);
    } else {
      setLockChangeOgLogo(false);
    }

    setLastOgLogoId(file?.id);
  };

  useEffect(() => {
    if (project) {
      setName(project.name);
      setSlug(project.slug);
      setDescription(project.description);

      const time = currentTime(project.publishedAt);
      time.setHours(time.getHours() + 2);
      setPublishAt(time.toISOString().slice(0, 16));
    }
  }, []);

  if (authed === 'loading') return <LoadingPage />;
  const user = session?.user as UserInterface;

  return (
    <>
      <Head>
        <title>Edytuj projekt - Panel - Piotr Doniak</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PanelLayout>
        <div className="flex flex-row items-center justify-between rounded-lg bg-gray-100 p-4">
          <div className="flex flex-row items-center space-x-3">
            <div>
              <Link
                as={NextLink}
                href="/panel/projekty"
                className="block rounded px-1.5 py-4 hover:bg-gray-200"
              >
                <FaArrowLeft />
              </Link>
            </div>
            <div>
              <h1 className="text-xl font-bold">Edytuj projekt #{project.id}</h1>
              <div>Co tam masz ciekawego, {user?.firstName}?</div>
            </div>
          </div>
          <HStack spacing={2}>
            <Button
              isLoading={isUpdating}
              colorScheme="green"
              onClick={() => handleUpdateProject()}
            >
              Zapisz zmiany
            </Button>
            <Link as={NextLink} href={`/projekty/${project.slug}`} target="_blank">
              <IconButton
                aria-label="Podgląd projektu"
                icon={<FiEye />}
                colorScheme="blue"
                variant="outline"
              />
            </Link>
            <IconButton
              aria-label="Usuń projekt"
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
                name="name"
                id="name"
                placeholder="np. znanapraca.pl"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Slug (do url)</FormLabel>
              <Input
                type="text"
                name="slug"
                id="slug"
                placeholder="np. znanapraca"
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
              placeholder="Opisz projekt w kilku słowach"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <HStack spacing={4}>
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
          {/* <div>
            <EditorComponent onUpdate={(c) => setContent(c)} initValue={post.content} />
          </div> */}
          <div className="pt-6">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading as="h3" size="md">
                Wgraj logo
              </Heading>
              <Button
                isLoading={isUpdating}
                colorScheme="green"
                onClick={() => handleUpdateProject()}
              >
                Zapisz zmiany
              </Button>
            </Flex>
            <Divider my={4} />
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              <GridItem>
                <FilePond
                  oninit={() => handleLogoUploaderInit()}
                  onaddfile={(error, file) => handleLogoUpdate(file)}
                  ref={filepondLogoRef}
                  name="logo"
                  allowPaste={false}
                  dropOnPage={true}
                  labelIdle='Przeciągnij i upuść lub <span class="filepond--label-action">wyszukaj</span>'
                  labelFileWaitingForSize="Kalkulowanie rozmiaru"
                  labelFileLoading="Wczytywanie"
                />
              </GridItem>
              <GridItem>
                <FilePond
                  oninit={() => handleLogoUploaderInit()}
                  onaddfile={(error, file) => handleOgLogoUpdate(file)}
                  ref={filepondOgLogoRef}
                  name="ogLogo"
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
                Jesteś pewien, że chcesz usunąć ten projekt? Tej operacji{' '}
                <span className="font-bold underline">nie</span> można cofnąć!
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeConfirmDialog}>
                  Anuluj
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteProject()}
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
  const { project } = await fetch(`${origin}/api/projects/manage?id=${query.id}`, {
    headers: {
      cookie: req.headers.cookie || '',
    },
  }).then((res) => res.json());

  if (!project) return { notFound: true };

  return {
    props: {
      project,
    },
  };
}
