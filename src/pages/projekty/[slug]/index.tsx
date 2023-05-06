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
} from '@chakra-ui/react';
import { Project, ProjectMenu, ProjectMenuContent } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

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
            <div className="mb-6 flex flex-row items-center justify-between space-x-1 ">
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
                    <Text fontSize="sm" color="gray.500">
                      od{' '}
                      <DateComponent
                        dateString={new Date(project.publishedAt).toISOString()}
                        fullDate
                      />
                    </Text>
                  </div>
                </div>
              </div>
              <div>
                <Link href={project.url} passHref target="_blank">
                  <Button colorScheme="yellow" rightIcon={<FiExternalLink />}>
                    Zobacz stronę
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-2 leading-6 tracking-normal">
              <p>{project.description || project.shortDescription}</p>
            </div>
            <Divider my={6} />
            {project.projectMenu?.length > 0 && (
              <div className="mt-6">
                <Tabs variant="unstyled" colorScheme="green">
                  <TabList gap={2}>
                    {project.projectMenu?.map((menu) => (
                      <Tab
                        rounded="lg"
                        fontWeight="bold"
                        color="gray.700"
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
                  <TabPanels>
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

export async function getStaticProps({ params }) {
  const { slug } = params;
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  const { project } = await fetch(`${origin}/api/projects?id=${slug}`).then((res) => res.json());

  if (!project) return { notFound: true };

  const meta = {
    title: `Projekt - ${project.name} - Piotr Doniak`,
    description: project.shortDescription || project.description || '',
    url: `https://piotrdoniak.com/projekty/${project.slug}`,
    image: project.image,
  };

  return {
    props: {
      project,
      siteMeta: meta,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  const { projects } = await fetch(`${origin}/api/projects`).then((res) => res.json());
  const paths = projects.map((project: Project) => ({
    params: { slug: project.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}
