import { BarLoader } from 'react-spinners';

export default function LoadingPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <BarLoader color="#212121" width={150} aria-label="Ładowanie..." />
    </div>
  );
}
