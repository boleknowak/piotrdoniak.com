import { useLocalStorage } from '@/hooks/useLocalStorage';
import * as gtag from '@/lib/gtag';
import { useEffect } from 'react';
import Layout from '@/components/Layouts/Layout';
import SeoTags from '@/components/SeoTags';

export default function Privacy({ siteMeta }) {
  const [useGoogleAnalytics, setUseGoogleAnalytics] = useLocalStorage(
    'useGoogleAnalytics',
    'accepted'
  );

  useEffect(() => {
    gtag.manageConsent(useGoogleAnalytics);
  }, [useGoogleAnalytics]);

  const toggleUseGoogleAnalytics = (event) => {
    if (event.target.checked) {
      setUseGoogleAnalytics('accepted');
    } else {
      setUseGoogleAnalytics('rejected');
    }
  };

  const getGoogleAnalyticsStatus = () => useGoogleAnalytics;

  return (
    <>
      <SeoTags title={siteMeta?.title} />
      <Layout>
        <div className="flex h-full w-full items-center justify-center">
          <div>
            <div>Tutaj wyłączysz Google Analytics</div>
            <div>
              <div className="mt-4">
                <label htmlFor="useGoogleAnalytics" className="mr-2">
                  Use Google Analytics ({getGoogleAnalyticsStatus()})
                </label>
                <input
                  type="checkbox"
                  id="useGoogleAnalytics"
                  checked={useGoogleAnalytics === 'accepted'}
                  onChange={toggleUseGoogleAnalytics}
                />
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
    title: 'Prywatność - Piotr Doniak',
  };

  return {
    props: {
      siteMeta: meta,
    },
  };
};
