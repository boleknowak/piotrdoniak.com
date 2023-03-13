import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { UserInterface } from '@/interfaces/UserInterface';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function PanelSettings() {
  const { data: session, status: authed } = useSession();

  if (authed === 'loading') return <LoadingPage />;

  const user = session?.user as UserInterface;

  return (
    <>
      <Head>
        <title>Ustawienia - Panel - Piotr Doniak</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PanelLayout>
        <h1 className="text-xl font-bold">Ustawienia</h1>
        <div>{user?.firstName}, tu dodasz tagi, obrazki i inne.</div>
      </PanelLayout>
    </>
  );
}
