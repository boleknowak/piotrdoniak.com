import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
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
  useToast,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { currentTime } from '@/lib/currentTime';
import { formatDistance } from '@/lib/helpers';
import { useRouter } from 'next/router';

export default function PanelProjectsCreate() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [imageWidth, setImageWidth] = useState('72');
  const [imageHeight, setImageHeight] = useState('72');
  const [bgColor, setBgColor] = useState('#000000');
  const [fontColor, setFontColor] = useState('#ffffff');
  const [publishAt, setPublishAt] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { data: session, status: authed } = useSession();
  const toast = useToast();
  const router = useRouter();

  const handleCreateProject = async () => {
    setIsCreating(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('url', url);
    formData.append('imageWidth', imageWidth);
    formData.append('imageHeight', imageHeight);
    formData.append('bgColor', bgColor);
    formData.append('fontColor', fontColor);
    formData.append('publishedAt', currentTime(publishAt).toISOString());

    const response = await fetch('/api/projects/manage', {
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
      router.push('/panel/projekty');
    }
  };

  if (authed === 'loading') return <LoadingPage />;
  const user = session?.user as UserInterface;

  return (
    <>
      <Head>
        <title>Nowy projekt - Panel - Piotr Doniak</title>
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
              <h1 className="text-xl font-bold">Nowy projekt</h1>
              <div>Stworzyłeś coś, {user?.firstName}?</div>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <Button isLoading={isCreating} colorScheme="green" onClick={handleCreateProject}>
              Dodaj projekt
            </Button>
          </div>
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
          <FormControl>
            <FormLabel>Link do projektu</FormLabel>
            <Input
              type="text"
              name="url"
              id="url"
              placeholder="Link do projektu (jeśli jest), warto dodać utm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </FormControl>
          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Kolor tła</FormLabel>
              <Input
                type="color"
                name="bgColor"
                id="bgColor"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Kolor czcionki</FormLabel>
              <Input
                type="color"
                name="fontColor"
                id="fontColor"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Szerokość obrazka</FormLabel>
              <Input
                type="text"
                name="imageWidth"
                id="imageWidth"
                value={imageWidth}
                onChange={(e) => setImageWidth(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Wysokość obrazka</FormLabel>
              <Input
                type="text"
                name="imageHeight"
                id="imageHeight"
                value={imageHeight}
                onChange={(e) => setImageHeight(e.target.value)}
              />
            </FormControl>
          </HStack>
        </div>
      </PanelLayout>
    </>
  );
}
