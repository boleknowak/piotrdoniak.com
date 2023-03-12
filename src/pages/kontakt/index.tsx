import Layout from '@/components/Layout';
import { Sofia } from 'next/font/google';
import Head from 'next/head';
import { faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Social from '@/components/Social';

const sofia = Sofia({ subsets: ['latin'], weight: '400' });

export default function Contact({ siteMeta }) {
  const socials = [
    {
      name: 'LinkedIn',
      text: 'Piotr Doniak',
      icon: faLinkedin,
      color: '#0a66c2',
      url: 'https://www.linkedin.com/in/piotrdoniak/?utm_source=piotrdoniak.com&utm_medium=portfolio&utm_campaign=kontakt',
    },
    {
      name: 'GitHub',
      text: 'boleknowak',
      icon: faGithub,
      color: '#333',
      url: 'https://github.com/boleknowak/?utm_source=piotrdoniak.com&utm_medium=portfolio&utm_campaign=kontakt',
    },
    {
      name: 'Instagram',
      text: 'piotrdoniak',
      icon: faInstagram,
      color: '#e1306c',
      url: 'https://www.instagram.com/piotrdoniak/?utm_source=piotrdoniak.com&utm_medium=portfolio&utm_campaign=kontakt',
    },
  ];

  return (
    <>
      <Head>
        <title>{siteMeta?.title}</title>
        <meta name="description" content={siteMeta?.description} />
        <meta property="og:title" content={siteMeta?.title} />
        <meta property="og:description" content={siteMeta?.description} />
        <meta property="og:image" content={siteMeta?.image} />
        <meta property="og:url" content={siteMeta?.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta property="twitter:domain" content="piotrdoniak.com" />
        <meta property="twitter:url" content={siteMeta?.url} />
        <meta name="twitter:title" content={siteMeta?.title} />
        <meta name="twitter:description" content={siteMeta?.description} />
        <meta name="twitter:image" content={siteMeta?.image} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="mb-20 flex h-full w-full items-center justify-center">
          <div>
            <div className="w-full max-w-2xl text-[#43403C]">
              <h1 className="mb-4 text-2xl font-bold">Kontakt</h1>
              <div>
                <p>
                  Doszedłem do wniosku, że najlepszym sposobem na kontakt jest rozmowa z
                  człowiekiem, <br />a nie z robotem. Dlatego, jeśli masz pytania, sugestie, lub
                  chcesz po prostu o <span className="italic">czymś</span> porozmawiać, napisz do
                  mnie! Odpowiem na każdą wiadomość, ręcznie - bez udziału robotów{' '}
                  <span className={sofia.className}>;)</span>
                </p>
              </div>
              <div className="mt-10">
                <div className="mb-2 font-bold">Social Media</div>
                <div className="grid grid-cols-3 gap-4">
                  {socials.map((social) => (
                    <Social social={social} />
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <div className="mb-2 font-bold">Formularz</div>
                <div>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Twoja nazwa <span className="text-red-500">*</span>
                        </label>
                        <div>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="np. Piotr"
                            className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Adres email <span className="text-red-500">*</span>
                        </label>
                        <div>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="np. piotr@przykladowy.pl"
                            className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Wiadomość <span className="text-red-500">*</span>
                      </label>
                      <div>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          cols={50}
                          placeholder="Aa"
                          className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                        ></textarea>
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-yellow-600"
                      >
                        Wyślij
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async () => {
  const meta = {
    title: 'Kontakt - Piotr Doniak',
    description: `Chcesz porozmawiać? Skontaktuj się ze mną, a ja odpowiem na Twoje pytania.`,
    image: 'https://piotrdoniak.com/images/brand/me.png',
    url: 'https://piotrdoniak.com/kontakt',
  };

  return {
    props: {
      siteMeta: meta,
    },
  };
};
