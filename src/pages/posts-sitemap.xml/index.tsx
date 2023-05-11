import { getServerSideSitemapLegacy } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import absoluteUrl from 'next-absolute-url';
import { Post } from '@prisma/client';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { origin } = absoluteUrl(ctx.req);
  const { posts } = await fetch(`${origin}/api/posts?all=1`, {
    headers: {
      cookie: ctx.req.headers.cookie || '',
    },
  }).then((res) => res.json());

  const fields = [];

  posts.forEach((post: Post) => {
    fields.push({
      loc: `${origin}/post/${post.slug}`,
      lastmod: new Date(post.publishedAt).toISOString(),
    });
  });

  return getServerSideSitemapLegacy(ctx, fields);
};

export default function Sitemap() {}
