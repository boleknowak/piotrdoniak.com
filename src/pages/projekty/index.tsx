import Layout from '@/components/Layout';
import Project from '@/components/Project';
import Head from 'next/head';

export default function Projects({ siteMeta }) {
  const projects = [
    {
      id: 1,
      title: 'znanapraca.pl',
      description: `Portal umożliwiający przeglądanie i wyszukiwanie ofert pracy. Model B2B połączony z modelem B2C, gdzie firmy mogą publikować swoje oferty pracy i pozyskiwać nowych pracowników.`,
      url: 'https://znanapraca.pl/?utm_source=piotrdoniak.com&utm_medium=portfolio&utm_campaign=projekty',
      image: '/images/projects/znanapraca.png',
    },
    {
      id: 2,
      title: 'grawslowka.pl',
      description: `Wieloosobowa gra przeglądarkowa, w której można sprawdzić swoją wiedzę o posiadanym słownictwie. Znajduje się tam również popularna gra Wordle.`,
      url: 'https://grawslowka.pl/?utm_source=piotrdoniak.com&utm_medium=portfolio&utm_campaign=projekty',
      image: '/images/projects/grawslowka.png',
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
        <div className="mb-20 mt-6 flex h-full w-full items-center justify-center md:mt-0">
          <div>
            <div className="w-full max-w-2xl text-[#43403C]">
              <h1 className="mb-4 text-2xl font-bold">Projekty</h1>
              <div className="space-y-2 leading-6 tracking-normal">
                <p>
                  Hej, cieszę się, że tu jesteś! W tym miejscu znajdziesz moje najnowsze projekty z
                  zakresu programowania i marketingu. Jako osoba pasjonująca się obiema dziedzinami,
                  staram się tworzyć rozwiązania, które mogą pomóc w rozwoju biznesu online.
                </p>
              </div>
              <div className="mt-10 space-y-4">
                {projects.map((project) => (
                  <Project key={project.id} project={project} />
                ))}
              </div>
              <div className="mt-10 leading-6 tracking-normal">
                <p>
                  Ale wiesz co? To nie wszystko, co dla Ciebie przygotałem! Na innych podstronach
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

export const getServerSideProps = async () => {
  const meta = {
    title: 'Projekty - Piotr Doniak',
    description: `Projekty stworzone przez autora strony. Przejrzyj je i zobacz, co potrafię.`,
    image: 'https://piotrdoniak.com/images/brand/me.png',
    url: 'https://piotrdoniak.com/projekty',
  };

  return {
    props: {
      siteMeta: meta,
    },
  };
};
