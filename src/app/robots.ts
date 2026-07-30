import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

export default function robots (): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/app/'] },
    sitemap: `${SITE.marketUrl}/sitemap.xml`
  }
}
