import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ahsan-ai-hub.vercel.app'
  const lastModified = new Date()

  const routes = [
    '',
    '/about',
    '/blog',
    '/careers',
    '/contact',
    '/content-tools',
    '/cookies',
    '/docs',
    '/faq',
    '/features',
    '/feedback',
    '/privacy',
    '/recommendations',
    '/settings',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
