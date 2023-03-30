import { getServerSideSitemapLegacy } from 'next-sitemap';
import { GetServerSideProps } from 'next';
// import absoluteUrl from 'next-absolute-url';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const { origin } = absoluteUrl(ctx.req);
  // const { posts } = await fetch(`${origin}/api/posts`, {
  //   headers: {
  //     cookie: ctx.req.headers.cookie || '',
  //   },
  // }).then((res) => res.json());

  const fields = [];

  // posts.forEach((post) => {
  //   fields.push({
  //     loc: `${origin}/post/${post.id}`,
  //     lastmod: new Date(post.createdAt).toISOString(),
  //   });
  // });

  return getServerSideSitemapLegacy(ctx, fields);
};

export default function Sitemap() {}
