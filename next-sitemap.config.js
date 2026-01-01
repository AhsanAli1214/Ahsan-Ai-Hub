/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ahsan-ai-hub.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 1.0,
  additionalPaths: async (config) => [
    await config.transform(config, '/recommendations'),
    await config.transform(config, '/content-tools'),
    await config.transform(config, '/feedback'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://ahsan-ai-hub.vercel.app/sitemap.xml',
    ],
  },
};
