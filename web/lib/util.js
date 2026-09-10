export const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const citySlug = (city) => slugify(city);

export function cityDisplay(slug) {
  return slug
    .split('-')
    .map((w) => (w === 'york' || w === 'york,' ? 'York' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
    .replace('East York', 'East York')
    .replace('North York', 'North York');
}
