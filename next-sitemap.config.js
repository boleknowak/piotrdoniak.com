/** @type {import('next-sitemap').IConfig} */

const APP_URL = process.env.APP_URL || 'https://piotrdoniak.com';

module.exports = {
  siteUrl: APP_URL,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  autoLastmod: true,
  exclude: [
    '/404',
    '/404.html',
    '/_error',
    '/_error.html',
    '/posts-sitemap.xml',
    '/panel',
    '/panel/*',
  ],
  robotsTxtOptions: {
    additionalSitemaps: [`${APP_URL}/posts-sitemap.xml`],
    policies: [
      {
        userAgent: '*',
        disallow: '',
      },
    ],
  },
  transform: async (config, path) => {
    let priority = 0.7;
    if (path === '/') {
      priority = 1;
    } else {
      priority = config.priority;
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
