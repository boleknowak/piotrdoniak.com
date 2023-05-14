import Layout from '@/components/Layouts/Layout';
import Image from 'next/image';

function Error({ statusCode }) {
  return (
    <Layout>
      <div className="flex h-full w-full items-center justify-center">
        <div>
          <div className="w-full max-w-2xl text-black">
            <div className="relative w-full">
              <Image src="/images/blob.png" alt="Nie ma takiej strony" width={500} height={500} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <div className="text-2xl font-bold">{statusCode}</div>
                <div>
                  Ups! {statusCode === 404 && 'Nie ma takiej strony.'}
                  {statusCode === 500 && 'Błąd serwera.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }) => {
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
