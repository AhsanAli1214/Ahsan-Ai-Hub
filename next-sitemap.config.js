module.exports = {
  siteUrl: "https://ahsan-ai-hub.vercel.app",
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 50000,
  generateIndexSitemap: true,
  exclude: ['/admin', '/api'],
  robotsTxtOptions: {
    sitemaps: [
      'https://ahsan-ai-hub.vercel.app/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
};
