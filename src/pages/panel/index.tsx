import PanelLayout from '@/components/Layouts/PanelLayout';
import LoadingPage from '@/components/LoadingPage';
import { UserInterface } from '@/interfaces/UserInterface';
import { useSession } from 'next-auth/react';

export default function PanelIndex() {
  const { data: session, status: authed } = useSession();

  if (authed === 'loading') return <LoadingPage />;

  const user = session?.user as UserInterface;

  // const isAuthorized = user?.is_authorized;

  return (
    <PanelLayout>
      <h1 className="text-xl font-bold">No dzień dobry, {user?.firstName}!</h1>
    </PanelLayout>
  );
}
