import { venues } from '@/lib/venues';
import { SITE_URL, SITE_NAME } from '@/lib/site';

export const dynamic = 'force-static';

const escapeXml = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export function GET() {
  const buildDate = new Date().toUTCString();
  const items = venues
    .map((v) => {
      const url = `${SITE_URL}/venues/${v.slug}`;
      const desc = [
        `${v.tags[0] || 'Party venue'} in ${v.city}, Ontario.`,
        v.rating ? `Rated ${v.rating}/5 from ${v.reviews.toLocaleString('en-CA')} Google reviews.` : '',
        v.fromPrice ? `Birthday party packages from $${v.fromPrice} CAD.` : '',
      ]
        .filter(Boolean)
        .join(' ');
      return `    <item>
      <title>${escapeXml(v.name)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(desc)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>A hand-curated directory of kids birthday party venues across the Greater Toronto Area.</description>
    <language>en-CA</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
