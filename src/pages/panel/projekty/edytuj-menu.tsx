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
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRef, useState } from 'react';
import { FaArrowLeft, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { FiExternalLink, FiEye, FiHeart } from 'react-icons/fi';
import absoluteUrl from 'next-absolute-url';
import DateComponent from '@/components/Date';
import { formatDistance } from '@/lib/helpers';
import Image from 'next/image';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { ProjectMenu, ProjectMenuContent } from '@prisma/client';
import EditorComponent from '@/components/Elements/EditorComponent';

export default function PanelProjectsUpdateMenu({ project }) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editingMenuName, setEditingMenuName] = useState('');
  const [editingMenuPosition, setEditingMenuPosition] = useState(0);
  const [creatingContentPosition, setCreatingContentPosition] = useState(0);
  const [creatingContent, setCreatingContent] = useState('');
  const [creatingMenuName, setCreatingMenuName] = useState('');
  const [creatingMenuPosition, setCreatingMenuPosition] = useState(0);
  const [isUpdatingContent, setIsUpdatingContent] = useState(false);
  const [updatingContentId, setIsUpdatingContentId] = useState(null);
  const [updatingContent, setUpdatingContent] = useState('');
  const [updatingContentPosition, setUpdatingContentPosition] = useState(0);
  const [removeObject, setRemoveObject] = useState(null);
  const [removeId, setRemoveId] = useState(null);
  const [removeSecondId, setRemoveSecondId] = useState(null);
  const {
    isOpen: isConfirmDialogOpened,
    onOpen: openConfirmDialog,
    onClose: closeConfirmDialog,
  } = useDisclosure();
  const cancelRef = useRef();
  const { data: session, status: authed } = useSession();
  const toast = useToast();

  const createMenu = async () => {
    setIsCreating(true);

    const formData = new FormData();
    formData.append('name', creatingMenuName);
    formData.append('position', creatingMenuPosition.toString());

    const response = await fetch(`/api/projects/manage-menu?projectId=${project.id}&object=menu`, {
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
  };

  const updateMenu = async () => {
    setIsUpdating(true);

    const formData = new FormData();
    formData.append('name', editingMenuName);
    formData.append('position', editingMenuPosition.toString());

    const response = await fetch(
      `/api/projects/manage-menu?projectId=${project.id}&menuId=${editingMenuId}&object=menu`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      }
    );

    const data = await response.json();

    setIsUpdating(false);
    setIsEditingMenu(false);
    toast({
      title: data.message,
      description: data.error_message || null,
      status: data.success ? 'success' : 'error',
      duration: data.success ? 3000 : 9000,
      isClosable: true,
    });
  };

  const removeMenu = async (id) => {
    setIsDeleting(true);

    const response = await fetch(
      `/api/projects/manage-menu?projectId=${project.id}&menuId=${id}&object=menu`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const data = await response.json();

    setIsDeleting(false);
    toast({
      title: data.message,
      description: data.error_message || null,
      status: data.success ? 'success' : 'error',
      duration: data.success ? 3000 : 9000,
      isClosable: true,
    });
  };

  const createContent = async (id) => {
    setIsCreating(true);

    const formData = new FormData();
    formData.append('content', creatingContent);
    formData.append('position', creatingContentPosition.toString());

    const response = await fetch(
      `/api/projects/manage-menu?projectId=${project.id}&menuId=${id}&object=content`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      }
    );

    const data = await response.json();

    setIsCreating(false);
    setIsCreatingContent(false);
    toast({
      title: data.message,
      description: data.error_message || null,
      status: data.success ? 'success' : 'error',
      duration: data.success ? 3000 : 9000,
      isClosable: true,
    });
  };

  const updateContent = async (id) => {
    setIsUpdating(true);

    const formData = new FormData();
    formData.append('content', updatingContent);
    formData.append('position', updatingContentPosition.toString());

    const response = await fetch(
      `/api/projects/manage-menu?projectId=${project.id}&menuId=${id}&contentId=${updatingContentId}&object=content`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      }
    );

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

  const removeContent = async (menuId, id) => {
    setIsDeleting(true);

    const response = await fetch(
      `/api/projects/manage-menu?projectId=${project.id}&menuId=${menuId}&contentId=${id}&object=content`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const data = await response.json();

    setIsDeleting(false);
    toast({
      title: data.message,
      description: data.error_message || null,
      status: data.success ? 'success' : 'error',
      duration: data.success ? 3000 : 9000,
      isClosable: true,
    });
  };

  const editMenu = (menu: ProjectMenu) => {
    if (isEditingMenu) {
      setIsEditingMenu(false);
      return;
    }

    setEditingMenuId(menu.id);
    setEditingMenuName(menu.name);
    setEditingMenuPosition(menu.position);
    setIsEditingMenu(true);
  };

  const editContent = (content: ProjectMenuContent) => {
    if (isUpdatingContent && updatingContentId === content.id) {
      setIsUpdatingContent(false);
      return;
    }

    setIsUpdatingContentId(content.id);
    setUpdatingContent(content.content);
    setUpdatingContentPosition(content.position);
    setIsUpdatingContent(true);
  };

  const removeObjectConfirmDialog = (object, id, secondId = null) => {
    setRemoveObject(object);
    setRemoveId(id);
    setRemoveSecondId(secondId);
    openConfirmDialog();
  };

  const removeObjectConfirmation = () => {
    if (removeObject === 'removeMenu') {
      removeMenu(removeId);
    }

    if (removeObject === 'removeContent') {
      removeContent(removeId, removeSecondId);
    }

    closeConfirmDialog();
    setRemoveId(null);
    setRemoveSecondId(null);
    setRemoveObject(null);
  };

  const likeProject = () => {
    toast({
      title: 'Tak, tak, lubisz ten projekt, wiem!',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  if (authed === 'loading') return <LoadingPage />;
  const user = session?.user as UserInterface;

  return (
    <>
      <Head>
        <title>Edytuj menu i treść - Panel - Piotr Doniak</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PanelLayout>
        <div className="flex flex-row items-center justify-between rounded-lg bg-gray-100 p-4">
          <div className="flex flex-row items-center space-x-3">
            <div>
              <Link href="/panel/projekty" className="block rounded px-1.5 py-4 hover:bg-gray-200">
                <FaArrowLeft />
              </Link>
            </div>
            <div>
              <h1 className="text-xl font-bold">Edytuj menu projektu #{project.id}</h1>
              <div>Co tam masz ciekawego, {user?.firstName}?</div>
            </div>
          </div>
          <HStack spacing={2}>
            <Link as={NextLink} href={`/projekty/${project.slug}`} target="_blank">
              <IconButton
                aria-label="Podgląd projektu"
                icon={<FiEye />}
                colorScheme="blue"
                variant="outline"
              />
            </Link>
          </HStack>
        </div>
        <div className="mx-auto mt-6 max-w-2xl space-y-4">
          <div className="mb-6 flex flex-col space-x-0 space-y-6 sm:flex-row sm:items-center sm:justify-between sm:space-x-1 sm:space-y-0">
            <div>
              <div className="flex flex-row items-center space-x-4">
                <div>
                  {project.logoImage && (
                    <Image
                      src={project.logoImage?.url}
                      alt={project.name}
                      width={project.imageWidth || 64}
                      height={project.imageHeight || 64}
                      className="rounded-lg"
                    />
                  )}
                </div>
                <div>
                  <Heading as="h2" size="md">
                    {project.name}
                  </Heading>
                  <Tooltip
                    label={
                      project.publishedAt
                        ? formatDistance(new Date(project.publishedAt).toISOString())
                        : 'Data publikacji'
                    }
                    aria-label="Data publikacji"
                    placement="right"
                    hasArrow
                  >
                    <Text fontSize="sm" color="gray.500" display="inline-block">
                      od{' '}
                      <DateComponent
                        dateString={new Date(project.publishedAt).toISOString()}
                        fullDate
                      />
                    </Text>
                  </Tooltip>
                  <div>
                    <Button
                      leftIcon={<FiHeart />}
                      variant="outline"
                      colorScheme="red"
                      size="xs"
                      aria-label="Polubienia"
                      onClick={() => likeProject()}
                    >
                      {project.likes}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {project.url && (
              <div>
                <Link href={project.url} target="_blank">
                  <Button colorScheme="yellow" w="full" rightIcon={<FiExternalLink />}>
                    Zobacz stronę
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="space-y-2 leading-6 tracking-normal">
            <p>{project.description}</p>
          </div>
          <Divider my={6} />
          {project.projectMenu?.length > 0 && (
            <div className="mt-6">
              <Tabs variant="unstyled" colorScheme="green" size={{ base: 'sm', md: 'md' }}>
                <TabList gap={2}>
                  {project.projectMenu?.map((menu) => (
                    <Tab
                      rounded="lg"
                      fontWeight="bold"
                      color="gray.600"
                      key={menu.id}
                      _selected={{
                        color: project.fontColor || 'black',
                        bg: project.bgColor || 'yellow.200',
                      }}
                      _hover={{
                        color: project.fontColor || 'black',
                        bg: project.bgColor || 'yellow.200',
                      }}
                    >
                      {menu.name}
                    </Tab>
                  ))}
                  <Tab
                    rounded="lg"
                    fontWeight="bold"
                    color={project.bgColor}
                    _selected={{
                      color: project.fontColor || 'black',
                      bg: project.bgColor || 'yellow.200',
                    }}
                    _hover={{
                      color: project.fontColor || 'black',
                      bg: project.bgColor || 'yellow.200',
                    }}
                  >
                    <AiOutlinePlusCircle />
                  </Tab>
                </TabList>
                <TabPanels mt={4} mx={-4}>
                  {project.projectMenu?.map((menu) => (
                    <TabPanel key={menu.id}>
                      <div className="space-y-4 leading-6 tracking-normal">
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            rightIcon={isEditingMenu ? <FaCaretUp /> : <FaCaretDown />}
                            onClick={() => editMenu(menu)}
                          >
                            Edytuj menu
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            rightIcon={isCreatingContent ? <FaCaretUp /> : <FaCaretDown />}
                            onClick={() => setIsCreatingContent(!isCreatingContent)}
                          >
                            Nowa treść
                          </Button>
                        </HStack>
                        {isEditingMenu && (
                          <div className="space-y-4 rounded bg-gray-50 p-4">
                            <FormControl isRequired>
                              <FormLabel>Nazwa</FormLabel>
                              <Input
                                type="text"
                                name="tab-name"
                                placeholder="Nazwa menu"
                                value={editingMenuName}
                                onChange={(e) => setEditingMenuName(e.target.value)}
                              />
                            </FormControl>
                            <FormControl isRequired>
                              <FormLabel>Pozycja</FormLabel>
                              <Input
                                type="number"
                                name="tab-position"
                                placeholder="Pozycja menu"
                                value={editingMenuPosition}
                                onChange={(e) => setEditingMenuPosition(Number(e.target.value))}
                              />
                            </FormControl>
                            <div className="space-x-2">
                              <Button
                                colorScheme="green"
                                isLoading={isUpdating}
                                onClick={() => updateMenu()}
                              >
                                Zapisz zmiany
                              </Button>
                              <Button
                                colorScheme="red"
                                variant="outline"
                                isLoading={isDeleting}
                                onClick={() => removeObjectConfirmDialog('removeMenu', menu.id)}
                              >
                                Usuń menu
                              </Button>
                            </div>
                          </div>
                        )}
                        {isCreatingContent && (
                          <div className="space-y-4 rounded bg-gray-50 p-4">
                            <FormControl isRequired>
                              <FormLabel>Pozycja</FormLabel>
                              <Input
                                type="number"
                                name="tab-position"
                                placeholder="Pozycja menu"
                                value={creatingContentPosition}
                                onChange={(e) => setCreatingContentPosition(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormControl isRequired>
                              <FormLabel>Treść</FormLabel>
                              <div>
                                <EditorComponent onUpdate={(c) => setCreatingContent(c)} />
                              </div>
                            </FormControl>
                            <div className="space-x-2">
                              <Button
                                colorScheme="green"
                                isLoading={isCreating}
                                onClick={() => createContent(menu.id)}
                              >
                                Zapisz zmiany
                              </Button>
                            </div>
                          </div>
                        )}
                        {menu.projectMenuContent?.map((content) => (
                          <div key={content.id} className="rounded border border-gray-200 p-4">
                            <div
                              dangerouslySetInnerHTML={{ __html: content.content }}
                              className="space-y-2"
                            />
                            <HStack spacing={2} mt={2}>
                              <Button
                                colorScheme="blue"
                                size="xs"
                                onClick={() => editContent(content)}
                              >
                                Edytuj
                              </Button>
                              <Button
                                colorScheme="red"
                                variant="outline"
                                size="xs"
                                isLoading={isDeleting}
                                onClick={() =>
                                  removeObjectConfirmDialog('removeContent', menu.id, content.id)
                                }
                              >
                                Usuń
                              </Button>
                            </HStack>
                            {isUpdatingContent && updatingContentId === content.id && (
                              <div className="space-y-4 rounded bg-gray-50 p-4">
                                <FormControl isRequired>
                                  <FormLabel>Pozycja</FormLabel>
                                  <Input
                                    type="number"
                                    name="tab-position"
                                    placeholder="Pozycja menu"
                                    value={updatingContentPosition}
                                    onChange={(e) =>
                                      setUpdatingContentPosition(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormControl isRequired>
                                  <FormLabel>Treść</FormLabel>
                                  <div>
                                    <EditorComponent
                                      onUpdate={(c) => setUpdatingContent(c)}
                                      initValue={content.content}
                                    />
                                  </div>
                                </FormControl>
                                <div className="space-x-2">
                                  <Button
                                    colorScheme="green"
                                    isLoading={isUpdating}
                                    onClick={() => updateContent(menu.id)}
                                  >
                                    Zapisz zmiany
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabPanel>
                  ))}
                  <TabPanel>
                    <div className="space-y-4 leading-6 tracking-normal">
                      <div className="space-y-4 rounded bg-gray-50 p-4">
                        <FormControl isRequired>
                          <FormLabel>Nazwa</FormLabel>
                          <Input
                            type="text"
                            name="tab-name"
                            placeholder="Nazwa menu"
                            value={creatingMenuName}
                            onChange={(e) => setCreatingMenuName(e.target.value)}
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>Pozycja</FormLabel>
                          <Input
                            type="number"
                            name="tab-position"
                            placeholder="Pozycja menu"
                            value={creatingMenuPosition}
                            onChange={(e) => setCreatingMenuPosition(Number(e.target.value))}
                          />
                        </FormControl>
                        <div className="space-x-2">
                          <Button
                            colorScheme="green"
                            isLoading={isCreating}
                            onClick={() => createMenu()}
                          >
                            Stwórz
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          )}
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
                  Jesteś pewien, że chcesz to usunąć? Tej operacji{' '}
                  <span className="font-bold underline">nie</span> można cofnąć!
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={closeConfirmDialog}>
                    Anuluj
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => removeObjectConfirmation()}
                    isLoading={isDeleting}
                    ml={3}
                  >
                    Usuń
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </div>
      </PanelLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { origin } = absoluteUrl(req);
  const { project } = await fetch(`${origin}/api/projects/manage-menu?projectId=${query.id}`, {
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
