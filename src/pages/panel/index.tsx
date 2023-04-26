import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { UserInterface } from '@/interfaces/UserInterface';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  InputGroup,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { FiDownload, FiFile } from 'react-icons/fi';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { BiTrashAlt } from 'react-icons/bi';
import * as socials_items from '@/lib/socials';

export default function PanelIndex() {
  const { data: session, status: authed } = useSession();
  const [file, setFile] = useState(null);
  const [error, setError] = useState<string>('');
  const [socials, setSocials] = useState([]);
  const [isLoadingSocials, setIsLoadingSocials] = useState(true);
  const inputRef = useRef(null);
  const toast = useToast();

  const fetchSocial = async (id: number) => {
    const response = await fetch(`/api/socials/ping?id=${id}`, {
      method: 'GET',
    });
    const data = await response.json();

    // set social by id, data.social and data.ping, data.ping is dynamic
    setSocials((items) =>
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      })
    );

    setIsLoadingSocials(false);
  };

  useEffect(() => {
    setIsLoadingSocials(true);
    setSocials(socials_items.socials);
    socials_items.socials.forEach((social) => {
      fetchSocial(social.id);
    });
  }, []);

  if (authed === 'loading') return <LoadingPage />;

  const user = session?.user as UserInterface;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch(process.env.NEXT_PUBLIC_FILE_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.status === 'success') {
      setFile(null);
      inputRef.current.value = '';
      setError('');
      toast({
        title: 'CV zostało zaktualizowane.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setError(data.error);
    }
  };

  const downloadFile = async (downloadOld = false) => {
    const old = downloadOld ? '?old=1' : '';
    const response = await fetch(process.env.NEXT_PUBLIC_FILE_DOWNLOAD_URL + old);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadOld
      ? `${process.env.NEXT_PUBLIC_FILE_NAME} (old).pdf`
      : `${process.env.NEXT_PUBLIC_FILE_NAME}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleChangeSwitch = async (social, event) => {
    const response = await fetch(`/api/socials/ping`, {
      method: 'POST',
      body: JSON.stringify({
        id: social.id,
        ping: event.target.checked,
      }),
    });

    const data = await response.json();

    setSocials((items) =>
      items.map((item) => {
        if (item.id === social.id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      })
    );

    toast({
      title: data.error_message || data.message,
      status: data.success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Head>
        <title>Panel - Piotr Doniak</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PanelLayout>
        <h1 className="text-xl font-bold">No dzień dobry, {user?.firstName}!</h1>
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Box bgColor="gray.100" p={2} rounded="md">
              <Heading as="h3" size="md">
                Zarządzanie CV
              </Heading>
              <Divider my={4} />
              <div>
                <FormControl isInvalid={!!error} isRequired>
                  <InputGroup>
                    <input
                      type="file"
                      accept="application/pdf"
                      name="pdf"
                      ref={inputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <HStack spacing={2}>
                      <Button
                        type="button"
                        colorScheme="yellow"
                        onClick={() => inputRef.current.click()}
                        leftIcon={<Icon as={FiFile} />}
                      >
                        {file ? file.name : 'Wybierz'}
                      </Button>
                      {file && (
                        <IconButton
                          type="button"
                          colorScheme="red"
                          onClick={() => {
                            setFile(null);
                            inputRef.current.value = '';
                            setError('');
                          }}
                          icon={<Icon as={BiTrashAlt} />}
                          aria-label="Usuń"
                        />
                      )}
                    </HStack>
                  </InputGroup>
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
                <Divider my={4} />
                <Box w="full">
                  <div className="flex flex-grow flex-row items-center space-x-2">
                    <Button
                      type="submit"
                      colorScheme="green"
                      onClick={handleFormSubmit}
                      leftIcon={<Icon as={AiOutlineCloudUpload} />}
                      w="full"
                    >
                      Wgraj
                    </Button>
                    <IconButton
                      type="button"
                      colorScheme="blue"
                      onClick={() => downloadFile()}
                      icon={<Icon as={FiDownload} />}
                      aria-label="Pobierz"
                    />
                  </div>
                </Box>
              </div>
            </Box>
            <Box bgColor="gray.100" p={2} rounded="md">
              <Heading as="h3" size="md">
                Social Ping
              </Heading>
              <Divider my={4} />
              {!isLoadingSocials && (
                <div>
                  {socials.map((item) => (
                    <div key={item.id}>
                      <FormControl
                        display="flex"
                        alignItems="center"
                        alignContent="space-between"
                        justifyContent="space-between"
                        w="full"
                      >
                        <FormLabel htmlFor={`new-content-${item.id}`} mb="0">
                          Nowa zawartość w {item.name}?
                        </FormLabel>
                        <Switch
                          id={`new-content-${item.id}`}
                          isChecked={item.ping}
                          onChange={(e) => handleChangeSwitch(item, e)}
                        />
                      </FormControl>
                    </div>
                  ))}
                </div>
              )}
            </Box>
          </div>
        </div>
      </PanelLayout>
    </>
  );
}
