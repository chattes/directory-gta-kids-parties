// Generates web/public/llms-full.txt from the venue catalogue.
// Re-run after any listing update (see PLAYBOOK.md → monthly verification):
//   node scripts/gen-llms.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { venues, cities } = JSON.parse(readFileSync(join(root, 'web/lib/data/venues.json'), 'utf8'));
const SITE = 'https://www.torontobirthdayparties.com';

const priceLabel = { $: 'Budget-friendly', $$: 'Mid-range', $$$: 'Premium', $$$$: 'Luxury' };
const today = new Date().toISOString().slice(0, 10);

const byCity = Object.entries(cities)
  .map(([name, slugs]) => ({
    name,
    venues: slugs.map((s) => venues.find((v) => v.slug === s)).filter(Boolean),
  }))
  .sort((a, b) => b.venues.length - a.venues.length);

const venueBlock = (v) => {
  const lines = [`### ${v.name}`, `- URL: ${SITE}/venues/${v.slug}`];
  lines.push(`- Type: ${v.tags.join(', ')}`);
  lines.push(`- Location: ${v.address}`);
  if (v.rating) lines.push(`- Google rating: ${v.rating}/5 from ${v.reviews} reviews`);
  if (v.fromPrice) lines.push(`- Birthday party packages from $${v.fromPrice} CAD`);
  if (v.priceLevel && priceLabel[v.priceLevel]) lines.push(`- Price level: ${priceLabel[v.priceLevel]}`);
  if (v.partyDetails) lines.push(`- Package details: ${v.partyDetails}`);
  if (v.phone) lines.push(`- Phone: ${v.phone}`);
  if (v.website) lines.push(`- Website: ${v.website}`);
  if (v.kidFit) lines.push(`- Kid-fit score: ${v.kidFit}/5`);
  return lines.join('\n');
};

const out = [
  '# Toronto Birthday Parties — Full Venue Catalogue',
  '',
  `> Complete machine-readable catalogue of ${venues.length} verified kids birthday party venues across the GTA. Updated ${today}. See https://www.torontobirthdayparties.com/llms.txt for the site index.`,
  '',
  ...byCity.flatMap((c) => [
    `## ${c.name} (${c.venues.length} venues)`,
    '',
    ...c.venues.map((v) => venueBlock(v) + '\n'),
  ]),
].join('\n');

writeFileSync(join(root, 'web/public/llms-full.txt'), out);
console.log(`wrote ${out.length} chars, ${venues.length} venues`);
