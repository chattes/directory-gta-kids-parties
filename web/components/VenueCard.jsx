import Link from 'next/link';
import { primaryTag, priceLabel, fromPriceLabel } from '@/lib/venues';

export default function VenueCard({ venue }) {
  const price = priceLabel(venue);
  const fromPrice = fromPriceLabel(venue);
  return (
    <article className="venue-card">
      <h3>
        <Link href={`/venues/${venue.slug}`}>{venue.name}</Link>
      </h3>
      <p className="venue-meta">
        <span className="tag">{primaryTag(venue)}</span>
        {venue.tags.slice(1, 3).map((t) => (
          <span className="tag tag-soft" key={t}>
            {t}
          </span>
        ))}
      </p>
      <p className="venue-city">
        📍 {venue.city}, ON
        {venue.rating ? (
          <span className="rating">
            {' '}
            ·{' '}
            <a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">
              ★ {venue.rating.toFixed(1)} ({venue.reviews.toLocaleString('en-CA')} reviews)
            </a>
          </span>
        ) : null}
        {price ? <span> · {price}</span> : null}
        {fromPrice ? <span className="tag tag-price venue-price-tag">{fromPrice}</span> : null}
      </p>
      {venue.partyDetails ? <p className="venue-party">{venue.partyDetails}</p> : null}
    </article>
  );
}
