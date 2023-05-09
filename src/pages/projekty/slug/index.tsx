import DateComponent from '@/components/Date';
import Layout from '@/components/Layouts/Layout';
import SeoTags from '@/components/SeoTags';
import {
  Button,
  Divider,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Project, ProjectMenu, ProjectMenuContent } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FiExternalLink, FiHeart } from 'react-icons/fi';
import { BsChevronLeft } from 'react-icons/bs';
import { formatDistance } from '@/lib/helpers';

type ProjectMenuWithContent = ProjectMenu & {
  projectMenuContent: ProjectMenuContent[];
};

type Props = {
  project: Project & {
    projectMenu: ProjectMenuWithContent[];
  };
  siteMeta: {
    title: string;
    description: string;
    url: string;
    image?: string;
  };
};

export default function ProjectDetails({ project, siteMeta }: Props) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isUpdatingLikes, setIsUpdatingLikes] = useState(false);

  let { url } = project;
  url = url.replace('{source}', 'project-details');

  const updateViews = async () => {
    try {
      await fetch(`/api/projects/views?slug=${project.slug}`, {
        method: 'POST',
      });
    } catch (error) {
      // console.log(error);
    }
  };

  const updateLikes = async () => {
    setIsUpdatingLikes(true);
    try {
      const response = await fetch(`/api/projects/likes?slug=${project.slug}`, {
        method: 'POST',
      });
      const data = await response.json();

      setIsUpdatingLikes(false);
      if (data.status !== 'error') {
        setLikes(data.likes);
        setLiked(data.liked);
      }
    } catch (error) {
      setIsUpdatingLikes(false);
    }
  };

  useEffect(() => {
    updateViews();
    setLikes(project.likes);

    const response = fetch(`/api/projects/likes?slug=${project.slug}`, {
      method: 'GET',
    });
    response
      .then((res) => res.json())
      .then((data) => {
        setLiked(data.liked);
      });
  }, []);

  return (
    <>
      <SeoTags
        title={siteMeta?.title}
        description={siteMeta?.description}
        url={siteMeta?.url}
        image={siteMeta?.image}
      />
      <Layout>
        <div className="mb-20 flex h-full w-full items-start pt-4 md:pt-10">
          <div className="mx-auto w-full max-w-2xl">
            <div className="-mt-6 mb-10">
              <Link href="/projekty" passHref>
                <Button colorScheme="gray" size="xs" leftIcon={<BsChevronLeft />}>
                  Wróć do listy projektów
                </Button>
              </Link>
            </div>
            <div className="mb-6 flex flex-col space-x-0 space-y-6 sm:flex-row sm:items-center sm:justify-between sm:space-x-1 sm:space-y-0">
              <div>
                <div className="flex flex-row items-center space-x-4">
                  <div>
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={project.imageWidth || 64}
                      height={project.imageHeight || 64}
                      className="rounded-lg"
                    />
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
                      <Tooltip
                        label={liked ? 'Lubisz to!' : 'Lubię to!'}
                        aria-label="Lubię to!"
                        placement="bottom"
                        hasArrow
                      >
                        <Button
                          leftIcon={liked ? <FaHeart /> : <FiHeart />}
                          variant={liked ? 'solid' : 'outline'}
                          colorScheme="red"
                          size="xs"
                          aria-label="Polub"
                          isLoading={isUpdatingLikes}
                          loadingText={likes.toString()}
                          onClick={() => updateLikes()}
                        >
                          {likes}
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
              {project.url && (
                <div>
                  <Link href={url} passHref target="_blank">
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
                  </TabList>
                  <TabPanels mt={4}>
                    {project.projectMenu?.map((menu) => (
                      <TabPanel key={menu.id}>
                        <div className="space-y-4 leading-6 tracking-normal">
                          {menu.projectMenuContent?.map((content) => (
                            <div key={content.id}>
                              <div
                                dangerouslySetInnerHTML={{ __html: content.content }}
                                className="space-y-2"
                              />
                            </div>
                          ))}
                        </div>
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

// export async function getStaticProps({ params }) {
//   const { slug } = params;
//   const origin = process.env.NEXT_PUBLIC_APP_URL;
//   const { project } = await fetch(`${origin}/api/projects?id=${slug}`).then((res) => res.json());

//   if (!project) return { notFound: true };

//   const meta = {
//     title: `Projekt - ${project.name} - Piotr Doniak`,
//     description: project.description || '',
//     url: `https://piotrdoniak.com/projekty/${project.slug}`,
//     image: project.image,
//   };

//   return {
//     props: {
//       project,
//       siteMeta: meta,
//     },
//     revalidate: 1,
//   };
// }

// export async function getStaticPaths() {
//   const origin = process.env.NEXT_PUBLIC_APP_URL;
//   const { projects } = await fetch(`${origin}/api/projects`).then((res) => res.json());
//   const paths = projects.map((project: Project) => ({
//     params: { slug: project.slug },
//   }));

//   return {
//     paths,
//     fallback: 'blocking',
//   };
// }
