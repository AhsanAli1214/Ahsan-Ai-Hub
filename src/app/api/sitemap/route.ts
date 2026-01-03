import { MetadataRoute } from 'next';

export async function GET() {
  const baseUrl = 'https://ahsan-ai-hub.vercel.app';

  // Comprehensive list of all public routes for full SEO power
  const pages = [
    '',
    '/recommendations',
    '/content-tools',
    '/about',
    '/contact',
    '/faq',
    '/settings',
    '/features',
    '/blog',
    '/careers',
    '/community',
    '/chat-history',
    '/docs',
    '/download-apk',
    '/privacy',
    '/terms',
    '/cookies',
    '/data-rights',
    '/api-reference',
    '/feedback',
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === '' || page === '/blog' ? 'always' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.startsWith('/api') || page.startsWith('/terms') ? '0.3' : '0.9'}</priority>
    ${page === '' ? `
    <image:image>
      <image:loc>${baseUrl}/og-image.png</image:loc>
      <image:title>Ahsan AI Hub - Free AI Tools</image:title>
      <image:caption>Experience privacy-first AI chat and content tools by Ahsan Ali</image:caption>
    </image:image>` : ''}
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
