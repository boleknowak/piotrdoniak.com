import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { UserInterface } from '@/interfaces/UserInterface';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { startLoading, finishLoading } from '@/lib/loader';

export default function PanelIndex() {
  const { data: session, status: authed } = useSession();

  if (authed === 'loading') return <LoadingPage />;

  const user = session?.user as UserInterface;

  // const isAuthorized = user?.is_authorized;

  const startLoadingFunc = () => {
    startLoading();
  };

  const stopLoadingFunc = () => {
    finishLoading();
  };

  return (
    <>
      <Head>
        <title>Panel - Piotr Doniak</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PanelLayout>
        <h1 className="text-xl font-bold">No dzień dobry, {user?.firstName}!</h1>
        <div className="mt-4 space-x-2">
          <button
            className="rounded bg-blue-600 px-2 py-1 text-white"
            onClick={() => startLoadingFunc()}
          >
            Start loading
          </button>
          <button
            className="rounded bg-blue-600 px-2 py-1 text-white"
            onClick={() => stopLoadingFunc()}
          >
            Finish loading
          </button>
        </div>
      </PanelLayout>
    </>
  );
}
