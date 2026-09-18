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
