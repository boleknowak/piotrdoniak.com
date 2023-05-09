import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { UserInterface } from '@/interfaces/UserInterface';
import { Project } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

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

  if (authed === 'loading') return <LoadingPage />;

  const user = session?.user as UserInterface;

  return (
    <>
      <Head>
        <title>Projekty - Panel - Piotr Doniak</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PanelLayout>
        <h1 className="text-xl font-bold">Projekty</h1>
        <div>Co stworzyłeś, {user?.firstName}?</div>
        <div>{JSON.stringify(projects?.map((p) => p.name))}</div>
      </PanelLayout>
    </>
  );
}
