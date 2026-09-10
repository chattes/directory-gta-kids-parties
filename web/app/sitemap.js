import { venues, cities } from '@/lib/venues';
import { SITE_URL } from '@/lib/site';

export default function sitemap() {
  const staticPages = ['', '/birthday-party-venues', '/contact'].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.8,
  }));
  const cityPages = cities.map((c) => ({
    url: `${SITE_URL}/birthday-party-venues/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));
  const venuePages = venues.map((v) => ({
    url: `${SITE_URL}/venues/${v.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...staticPages, ...cityPages, ...venuePages];
}
