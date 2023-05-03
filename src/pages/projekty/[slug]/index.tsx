import Layout from '@/components/Layouts/Layout';
import SeoTags from '@/components/SeoTags';
import { Project } from '@prisma/client';

type Props = {
  project: Project;
  siteMeta: {
    title: string;
    description: string;
    url: string;
  };
};

export default function ProjectDetails({ project, siteMeta }: Props) {
  return (
    <>
      <SeoTags title={siteMeta?.title} description={siteMeta?.description} url={siteMeta?.url} />
      <Layout>
        <div className="mb-20 flex h-full w-full items-start pt-4 md:pt-10">
          <div className="mx-auto w-full max-w-2xl">
            <h1 className="mb-4 text-2xl font-bold">{project.name}</h1>
            <div className="space-y-2 leading-6 tracking-normal">
              <p>{project.description || project.shortDescription}</p>
            </div>
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
    description: project.shortDescription,
    url: `https://piotrdoniak.com/projekty/${project.slug}`,
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
    fallback: false,
  };
}
