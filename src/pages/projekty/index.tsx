import Layout from '@/components/Layouts/Layout';
import Project from '@/components/Project';
import ProjectSkeleton from '@/components/ProjectSkeleton';
import SeoTags from '@/components/SeoTags';
import { Grid, GridItem } from '@chakra-ui/react';
import { Project as ProjectTypes } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function Projects({ siteMeta }) {
  const [projects, setProjects] = useState<ProjectTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    const response = await fetch('/api/projects');
    const data = await response.json();

    setProjects(data.projects);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <SeoTags title={siteMeta?.title} description={siteMeta?.description} url={siteMeta?.url} />
      <Layout>
        <div className="mb-20 mt-6 flex h-full w-full items-center justify-center md:mt-0">
          <div>
            <div className="w-full max-w-2xl text-[#212121]">
              <h1 className="mb-4 text-2xl font-bold">Projekty</h1>
              <div className="space-y-2 leading-6 tracking-normal">
                <p>
                  Hej, cieszę się, że tu jesteś! W tym miejscu znajdziesz moje najnowsze projekty z
                  zakresu programowania i marketingu. Jako osoba pasjonująca się obiema dziedzinami,
                  staram się tworzyć rozwiązania, które mogą pomóc w rozwoju biznesu online.
                </p>
              </div>
              <div className="mt-10">
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                  {isLoading && (
                    <>
                      <GridItem mx="auto">
                        <ProjectSkeleton />
                      </GridItem>
                      <GridItem mx="auto">
                        <ProjectSkeleton />
                      </GridItem>
                    </>
                  )}
                  {!isLoading &&
                    projects?.map((project) => (
                      <GridItem mx="auto" key={project.id}>
                        <Project project={project} source="projects-list" />
                      </GridItem>
                    ))}
                </Grid>
              </div>
              <div className="mt-10 leading-6 tracking-normal">
                <p>
                  Ale wiesz co? To nie wszystko, co dla Ciebie przygotowałem! Na innych podstronach
                  znajdziesz również kilka osobistych przemyśleń oraz anegdot, które mam nadzieję,
                  że Cię zainspirują.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const meta = {
    title: 'Projekty - Piotr Doniak',
    description: `Projekty stworzone przez autora strony. Przejrzyj je i zobacz, co potrafię.`,
    url: 'https://piotrdoniak.com/projekty',
  };

  // res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600');

  return {
    props: {
      siteMeta: meta,
    },
  };
};
