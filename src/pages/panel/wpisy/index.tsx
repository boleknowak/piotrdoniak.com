import DateComponent from '@/components/Date';
import ManageCategoriesModal from '@/components/Elements/Modals/ManageCategoriesModal';
import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { CategoryInterface } from '@/interfaces/CategoryInterface';
import { PostInterface } from '@/interfaces/PostInterface';
import { UserInterface } from '@/interfaces/UserInterface';
import { currentTime } from '@/lib/currentTime';
import {
  Avatar,
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Link,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GrRefresh } from 'react-icons/gr';
import { FaArrowRight, FaEye, FaHotjar, FaPen, FaShare } from 'react-icons/fa';
import NextLink from 'next/link';
import { isAfterDate, isHot } from '@/lib/helpers';

export default function PanelPosts() {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session, status: authed } = useSession();
  const {
    isOpen: isCategoriesModalOpened,
    onOpen: openCategoriesModal,
    onClose: closeCategoriesModal,
  } = useDisclosure();

  const fetchPosts = async () => {
    setIsFetching(true);
    const response = await fetch(`/api/posts?query=${searchQuery.toLocaleLowerCase()}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    setIsFetching(false);
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

  const formatNumber = (number: number, compact = true) =>
    new Intl.NumberFormat('pl-PL', {
      style: 'decimal',
      notation: compact ? 'compact' : 'standard',
      compactDisplay: 'short',
    }).format(number);

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
            <Link as={NextLink} href="/panel/wpisy/nowy">
              <Button rightIcon={<FaArrowRight />} colorScheme="yellow">
                Stwórz post
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-4 flex flex-row items-center justify-end">
            <div>
              <FormControl>
                <HStack>
                  <Input
                    placeholder="Szukaj..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        fetchPosts();
                      }
                    }}
                  />
                  <Button
                    isLoading={isFetching}
                    type="button"
                    colorScheme="yellow"
                    onClick={() => fetchPosts()}
                  >
                    Szukaj
                  </Button>
                </HStack>
              </FormControl>
            </div>
          </div>
          {posts.length === 0 && <div>Nie ma postów.</div>}
          {posts.length > 0 && (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Tytuł</Th>
                    <Th>Autor</Th>
                    <Th>Wyświetlenia</Th>
                    <Th>Publikacja</Th>
                    <Th isNumeric>Opcje</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {posts.map((post) => (
                    <Tr key={post.id}>
                      <Td>{post.id}</Td>
                      <Td maxW={60}>
                        <Text fontWeight="bold" className="truncate" title={post.title}>
                          {post.title}
                        </Text>
                      </Td>
                      <Td>
                        {post.author && (
                          <Link as={NextLink} href={`/panel/autorzy/${post.author.slug}`}>
                            <Tag
                              size="lg"
                              colorScheme={post.author.is_authorized ? 'green' : 'red'}
                              borderRadius="full"
                            >
                              <Avatar
                                src={post.author.image}
                                size="xs"
                                name={post.author.name}
                                ml={-1}
                                mr={2}
                              />
                              <TagLabel fontSize="xs">{post.author.name}</TagLabel>
                            </Tag>
                          </Link>
                        )}
                        {!post.author && (
                          <Text fontStyle="italic" color="gray.600">
                            brak autora
                          </Text>
                        )}
                      </Td>
                      <Td>
                        <Tooltip
                          label={`${formatNumber(post.views || 0, false)} wyśw. ${
                            isHot(post.views, post.publishedAt) ? '| HOT' : ''
                          }`}
                          placement="top"
                          aria-label="Wyświetlenia"
                        >
                          <Tag size="sm">
                            <TagLeftIcon as={FaEye} />
                            <TagLabel>{formatNumber(post.views || 0)}</TagLabel>
                            {isHot(post.views, post.publishedAt) && (
                              <TagRightIcon color="red.500" as={FaHotjar} />
                            )}
                          </Tag>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip
                          label={currentTime(post.publishedAt).toLocaleString()}
                          aria-label="Published at"
                          placement="top"
                        >
                          <Tag
                            colorScheme={isAfterDate(post.publishedAt) ? 'green' : 'red'}
                            size="sm"
                          >
                            <DateComponent dateString={post.publishedAt} />
                          </Tag>
                        </Tooltip>
                      </Td>
                      <Td isNumeric>
                        <HStack spacing={2} display="inline-block">
                          <Link href={`/post/${post.slug}`} target="_blank" display="inline-block">
                            <IconButton
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              aria-label="View"
                              icon={<FaEye />}
                            />
                          </Link>
                          <Tooltip label="Skopiuj link" aria-label="Skopiuj link" placement="top">
                            <IconButton
                              size="sm"
                              colorScheme="teal"
                              variant="outline"
                              aria-label="Share"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${process.env.NEXT_PUBLIC_APP_URL}/post/${post.slug}`
                                );
                              }}
                              icon={<FaShare />}
                            />
                          </Tooltip>
                          <Link href={`/panel/wpisy/edytuj?id=${post.id}`} display="inline-block">
                            <IconButton
                              size="sm"
                              colorScheme="yellow"
                              aria-label="View"
                              icon={<FaPen />}
                            />
                          </Link>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>#</Th>
                    <Th>Tytuł</Th>
                    <Th>Autor</Th>
                    <Th>Wyświetlenia</Th>
                    <Th>Publikacja</Th>
                    <Th isNumeric>Opcje</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
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
