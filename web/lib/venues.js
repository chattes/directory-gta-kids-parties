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

// Nearby cities for cross-linking hubs and ideas pages. Both directions are listed.
export const NEARBY_CITIES = {
  toronto: ['north-york', 'scarborough', 'east-york', 'mississauga', 'vaughan', 'markham'],
  'north-york': ['toronto', 'scarborough', 'vaughan', 'markham'],
  scarborough: ['toronto', 'north-york', 'markham', 'pickering'],
  'east-york': ['toronto', 'north-york', 'scarborough'],
  mississauga: ['oakville', 'brampton', 'vaughan', 'toronto'],
  oakville: ['mississauga', 'brampton'],
  brampton: ['mississauga', 'vaughan', 'oakville'],
  vaughan: ['brampton', 'north-york', 'markham', 'concord', 'woodbridge'],
  concord: ['vaughan', 'woodbridge', 'north-york'],
  woodbridge: ['vaughan', 'concord'],
  markham: ['scarborough', 'north-york', 'vaughan', 'pickering'],
  pickering: ['scarborough', 'markham', 'whitby'],
  whitby: ['pickering', 'markham'],
  aurora: ['vaughan', 'markham'],
};

// Price sentence for a list of venues with a fromPrice, sorted lowest first.
// "1 of them publishes a package price: $525." / "3 of them publish package prices, from $300 to $525."
export const priceSentence = (priced) => {
  const n = priced.length;
  if (!n) return 'None of them publish a package price.';
  const lo = priced[0].fromPrice;
  const hi = priced[n - 1].fromPrice;
  if (n === 1) return `1 of them publishes a package price: $${lo}.`;
  return lo === hi
    ? `${n} of them publish package prices, all from $${lo}.`
    : `${n} of them publish package prices, from $${lo} to $${hi}.`;
};

export const nearbyCities = (slug) =>
  (NEARBY_CITIES[slug] || [])
    .map((s) => cities.find((c) => c.slug === s))
    .filter(Boolean);

// Per-city facts computed from venue rows, used to give each hub page unique copy.
export function cityStats(slug) {
  const list = getVenuesByCity(slug);
  const priced = list.filter((v) => v.fromPrice).sort((a, b) => a.fromPrice - b.fromPrice);
  const rated = list.filter((v) => v.rating);
  const totalReviews = list.reduce((sum, v) => sum + (v.reviews || 0), 0);
  const avgRating = rated.length
    ? rated.reduce((sum, v) => sum + v.rating, 0) / rated.length
    : null;
  const tagCounts = new Map();
  list.forEach((v) => (v.tags || []).forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1)));
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
  return {
    count: list.length,
    priced,
    minPrice: priced.length ? priced[0].fromPrice : null,
    maxPrice: priced.length ? priced[priced.length - 1].fromPrice : null,
    avgRating,
    totalReviews,
    topTags,
  };
}
