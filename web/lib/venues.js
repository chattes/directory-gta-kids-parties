import data from './data/venues.json';
import { citySlug } from './util';

export const venues = data.venues;
export const cityMap = data.cities; // { cityName: [venueSlug, ...] }

export const cities = Object.entries(cityMap)
  .map(([name, slugs]) => ({ name, slug: citySlug(name), count: slugs.length }))
  .sort((a, b) => b.count - a.count);

export const getVenue = (slug) => venues.find((v) => v.slug === slug);

export const getVenuesByCity = (slug) =>
  venues
    .filter((v) => citySlug(v.city) === slug)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || b.reviews - a.reviews);

export const primaryTag = (v) => v.tags[0] || 'Party venue';

export const priceLabel = (v) =>
  ({ $: 'Budget-friendly', $$: 'Mid-range', $$$: 'Premium', $$$$: 'Luxury' })[v.priceLevel] || null;

export const fromPriceLabel = (v) => (v.fromPrice ? `from $${v.fromPrice}` : null);

const KID_FIT_LABELS = { 5: 'Perfect for kids', 4: 'Great for kids', 3: 'Good for kids', 2: 'Better for older kids', 1: 'Grown-up spot' };

const kidFitBase = (pct) => {
  const p = parseInt(pct, 10);
  if (Number.isNaN(p)) return 3;
  if (p >= 65) return 5;
  if (p >= 45) return 4;
  if (p >= 25) return 3;
  if (p >= 10) return 2;
  return 1;
};

// { score, label, title } or null — title carries the honest basis for hover
export const kidFitInfo = (v) => {
  if (!v.kidFit) return null;
  const pct = parseInt(v.kidReviewPct, 10);
  let title = Number.isNaN(pct)
    ? 'Kid-fit rating for birthday parties'
    : `Based on ${pct}% of recent Google reviews mentioning kids`;
  if (v.kidFit > kidFitBase(v.kidReviewPct)) title += ' · verified party packages';
  return { score: v.kidFit, label: KID_FIT_LABELS[v.kidFit], title };
};

// Ranking score used on city pages and in ideas pages. Documented on the page:
// Google rating x log10(reviews + 1) + 2 x kid-fit (1 to 5). Missing kid-fit adds 0.
export const venueScore = (v) =>
  (v.rating || 0) * Math.log10((v.reviews || 0) + 1) + 2 * (v.kidFit || 0);

export const rankPicks = (list, n = 5) =>
  list
    .filter((v) => v.rating && (v.kidFit || 0) >= 3)
    .sort((a, b) => venueScore(b) - venueScore(a) || b.reviews - a.reviews)
    .slice(0, n);

export const topPicks = (slug, n = 5) => rankPicks(getVenuesByCity(slug), n);

// Place names taken from the venue data, so a " - Whitby" style suffix can be told apart from marketing text.
const PLACE_WORDS = new Set(
  [...venues.map((v) => v.city), ...Object.keys(cityMap)].flatMap((c) => c.toLowerCase().split(/[\/-]|\s+/))
);

// Listing names come from Google and often carry marketing text after " | " or " - ".
// Keeps the part before " | ", drops leading emoji, and drops a " - " suffix unless it names a place.
export const displayName = (name = '') => {
  let s = String(name).split(' | ')[0].replace(/^[^\p{L}\p{N}]+/u, '').trim();
  const dash = s.indexOf(' - ');
  if (dash > 0) {
    const suffix = s.slice(dash + 3).trim();
    const isPlace = suffix
      .toLowerCase()
      .split(/[\/-]|\s+/)
      .filter(Boolean)
      .every((w) => PLACE_WORDS.has(w));
    if (!isPlace) s = s.slice(0, dash).trim();
  }
  return s;
};

// Dates in the data are ISO (YYYY-MM-DD). Render as "23 October 2026".
export const formatDate = (iso) =>
  iso
    ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-CA', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

export const formatMonthYear = (iso) =>
  iso
    ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-CA', { timeZone: 'UTC', year: 'numeric', month: 'long' })
    : null;
