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
  image?: string;
  schema?: unknown;
}

export default function SeoTags({ ...props }: SeoTagsProps) {
  const defaultTitle = 'Piotr Doniak';
  const defaultDescription =
    'Jestem Piotr i lubię marketing oraz programowanie. Sprawdź moje projekty i bloga, aby dowiedzieć się o mnie więcej.';
  const defaultKeywords =
    'Piotr, Piotrek, Piotr Doniak, Piotrek Doniak, Doniak, Marketing, Programowanie';
  const defaultUrl = 'https://piotrdoniak.com';
  const defaultType = 'website';
  const defaultImage = 'https://piotrdoniak.com/images/brand/me.png';

  const title = props.title ?? defaultTitle;
  const ogTitle = props.og_title ?? props.title ?? defaultTitle;
  const description = props.description ?? defaultDescription;
  const ogDescription = props.og_description ?? props.description ?? defaultDescription;
  const keywords = props.keywords ? `${props.keywords}, ${defaultKeywords}` : defaultKeywords;
  const url = props.url ?? defaultUrl;
  const canonicalUrl = props.canonicalUrl ?? url ?? defaultUrl;
  const type = props.type ?? defaultType;
  const image = props.image ?? defaultImage;

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
      <meta property="og:site_name" content="piotrdoniak.com" />
      <meta property="og:locale" content="pl_PL" />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@piotrdoniak" />
      <meta name="twitter:creator" content="@piotrdoniak" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {props.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(props.schema) }}
        />
      )}
    </Head>
  );
}
