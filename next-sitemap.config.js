/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ahsan-ai-hub.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 1.0,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://ahsan-ai-hub.vercel.app/api/sitemap',
    ],
  },
};
