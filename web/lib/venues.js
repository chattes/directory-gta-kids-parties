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
