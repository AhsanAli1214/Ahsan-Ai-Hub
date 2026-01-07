/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ahsan-ai-hub.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 1.0,
  exclude: ['/api/*'],
  autoLastmod: true,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/images/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/tool-icons/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/*.png',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/*.jpg',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/*.jpeg',
      },
    ],
    additionalSitemaps: [
      'https://ahsan-ai-hub.vercel.app/api/sitemap',
    ],
  },
};
