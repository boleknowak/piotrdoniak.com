import Head from 'next/head';

interface SeoTagsProps {
  title?: string;
  og_title?: string;
  description?: string;
  og_description?: string;
  keywords?: string;
  url?: string;
  canonicalUrl?: string;
  type?: string;
}

export default function SeoTags({ ...props }: SeoTagsProps) {
  const defaultTitle = 'Przygody.online - Gry i zagadki online dla każdego!';
  const defaultDescription =
    'Zagadki na przygody.online są idealnym wyborem dla miłośników przygód, łamigłówek i zadań do wykonania. Dołącz do nas już teraz!';
  const defaultKeywords =
    'przygody, gry, zagadki, łamigłówki, przygody online, wyzwania, gra, gra przygodowa, platforma, zabawa, rozrywka, emocje, rozwiązywanie zagadek, interaktywna gra, gra logiczna, gra zręcznościowa, gra dla dzieci, gra dla dorosłych, gra dla całej rodziny, gra mobilna, gra przeglądarkowa, gra online';
  const defaultUrl = 'https://przygody.online';
  const defaultType = 'website';

  const title = props.title ?? defaultTitle;
  const ogTitle = props.og_title ?? props.title ?? defaultTitle;
  const description = props.description ?? defaultDescription;
  const ogDescription = props.og_description ?? props.description ?? defaultDescription;
  const keywords = props.keywords ? `${props.keywords}, ${defaultKeywords}` : defaultKeywords;
  const url = props.url ?? defaultUrl;
  const canonicalUrl = props.canonicalUrl ?? defaultUrl;
  const type = props.type ?? defaultType;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="przygody.online" />
      <meta property="og:locale" content="pl_PL" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@przygodyonline" />
      <meta name="twitter:creator" content="@przygodyonline" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
