import { getServerSideSitemapLegacy } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import absoluteUrl from 'next-absolute-url';
import { PostInterface } from '@/interfaces/PostInterface';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { origin } = absoluteUrl(ctx.req);
  const { posts } = await fetch(`${origin}/api/posts?all=1`, {
    headers: {
      cookie: ctx.req.headers.cookie || '',
    },
  }).then((res) => res.json());

  const fields = [];

  posts.forEach((post: PostInterface) => {
    fields.push({
      loc: `${origin}/post/${post.slug}`,
      lastmod: new Date(post.createdAt).toISOString(),
    });
  });

  return getServerSideSitemapLegacy(ctx, fields);
};

export default function Sitemap() {}
