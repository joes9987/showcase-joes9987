import type { MetadataRoute } from 'next'
import { fallbackRoster } from '@/lib/members'
import { SITE } from '@/lib/site'

export default function sitemap (): MetadataRoute.Sitemap {
  const base = SITE.marketUrl
  const staticRoutes = ['', '/people', '/partners', '/for-partners', '/suite', '/login', '/signup'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }))
  const people = fallbackRoster().map((m) => ({
    url: `${base}/people/${m.github_handle}`,
    lastModified: new Date()
  }))
  return [...staticRoutes, ...people]
}
