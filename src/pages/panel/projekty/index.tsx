import DateComponent from '@/components/Date';
import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { UserInterface } from '@/interfaces/UserInterface';
import { currentTime } from '@/lib/currentTime';
import { isAfterDate } from '@/lib/helpers';
import {
  Button,
  HStack,
  IconButton,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { Project } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsFillMenuAppFill } from 'react-icons/bs';
import { FaArrowRight, FaEye, FaHeart, FaPen, FaShare } from 'react-icons/fa';

export default function PanelProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const { data: session, status: authed } = useSession();

  const fetchProjects = async () => {
    const response = await fetch('/api/projects/manage');
    const data = await response.json();
    setProjects(data.projects);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const formatNumber = (number: number, compact = true) =>
    new Intl.NumberFormat('pl-PL', {
      style: 'decimal',
      notation: compact ? 'compact' : 'standard',
      compactDisplay: 'short',
    }).format(number);

  if (authed === 'loading') return <LoadingPage />;

  const user = session?.user as UserInterface;

  return (
    <>
      <Head>
        <title>Projekty - Panel - Piotr Doniak</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PanelLayout>
        <div className="flex flex-row items-center justify-between rounded-lg bg-gray-100 p-4">
          <div>
            <h1 className="text-xl font-bold">Projekty</h1>
            <div>Co stworzyłeś, {user?.firstName}?</div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <Link href="/panel/projekty/nowy">
              <Button rightIcon={<FaArrowRight />} colorScheme="yellow">
                Nowy projekt
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-6">
          {projects?.length === 0 && <div>Nie ma projektów.</div>}
          {projects?.length > 0 && (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Nazwa</Th>
                    <Th>Interakcje</Th>
                    <Th>Publikacja</Th>
                    <Th isNumeric>Opcje</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {projects.map((project) => (
                    <Tr key={project.id}>
                      <Td>{project.id}</Td>
                      <Td maxW={60}>
                        <Text fontWeight="bold" className="truncate" title={project.name}>
                          {project.name}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Tooltip
                            label={`${formatNumber(project.views || 0, false)} wyświetleń`}
                            placement="top"
                            aria-label="Wyświetlenia"
                          >
                            <Tag size="sm">
                              <TagLeftIcon as={FaEye} color="blue.500" />
                              <TagLabel>{formatNumber(project.views || 0)}</TagLabel>
                            </Tag>
                          </Tooltip>
                          <Tooltip
                            label={`${formatNumber(project.likes || 0, false)} polubień`}
                            placement="top"
                            aria-label="Polubienia"
                          >
                            <Tag size="sm">
                              <TagLeftIcon as={FaHeart} color="red.500" />
                              <TagLabel>{formatNumber(project.likes || 0)}</TagLabel>
                            </Tag>
                          </Tooltip>
                        </HStack>
                      </Td>
                      <Td>
                        <Tooltip
                          label={currentTime(project.publishedAt).toLocaleString()}
                          aria-label="Published at"
                          placement="top"
                        >
                          <Tag
                            colorScheme={
                              isAfterDate(new Date(project.publishedAt).toISOString())
                                ? 'green'
                                : 'red'
                            }
                            size="sm"
                          >
                            <DateComponent
                              dateString={new Date(project.publishedAt).toISOString()}
                            />
                          </Tag>
                        </Tooltip>
                      </Td>
                      <Td isNumeric>
                        <HStack spacing={2} display="inline-block">
                          <Link href={`/projekty/${project.slug}`} target="_blank">
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
                                  `${process.env.NEXT_PUBLIC_APP_URL}/projekty/${project.slug}`
                                );
                              }}
                              icon={<FaShare />}
                            />
                          </Tooltip>
                          <Tooltip
                            label="Menu i zawartość"
                            aria-label="Menu i zawartość"
                            placement="top"
                          >
                            <Link href={`/panel/projekty/edytuj-menu?id=${project.id}`}>
                              <IconButton
                                size="sm"
                                colorScheme="yellow"
                                aria-label="Edit menu"
                                icon={<BsFillMenuAppFill />}
                              />
                            </Link>
                          </Tooltip>
                          <Link href={`/panel/projekty/edytuj?id=${project.id}`}>
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
                    <Th>Nazwa</Th>
                    <Th>Interakcje</Th>
                    <Th>Publikacja</Th>
                    <Th isNumeric>Opcje</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          )}
        </div>
      </PanelLayout>
    </>
  );
}
