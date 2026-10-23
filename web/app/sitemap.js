import { venues, cities } from '@/lib/venues';
import { SITE_URL } from '@/lib/site';
import { IDEA_CITIES } from '@/lib/ideas';

export default function sitemap() {
  const staticPages = ['', '/birthday-party-venues', '/contact'].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.8,
  }));
  const cityPages = cities.map((c) => ({
    url: `${SITE_URL}/birthday-party-venues/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));
  const ideaPages = IDEA_CITIES.map((slug) => ({
    url: `${SITE_URL}/birthday-party-ideas/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  const venuePages = venues.map((v) => ({
    url: `${SITE_URL}/venues/${v.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...staticPages, ...cityPages, ...ideaPages, ...venuePages];
}
