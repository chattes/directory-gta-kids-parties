import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import KidFitMeter from '@/components/KidFitMeter';
import { venues, getVenue, getVenuesByCity, primaryTag, priceLabel, kidFitInfo } from '@/lib/venues';
import { citySlug } from '@/lib/util';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) return {};
  return {
    title: `${v.name} — Kids Birthday Party Venue in ${v.city}`,
    description: `${v.name} is a ${primaryTag(v).toLowerCase()} in ${v.city}, Ontario${
      v.rating ? ` rated ${v.rating.toFixed(1)}★ from ${v.reviews.toLocaleString('en-CA')} Google reviews` : ''
    }. Verified birthday party venue — contact details, packages and location.`,
    alternates: { canonical: `${SITE_URL}/venues/${slug}` },
  };
}

export default async function VenuePage({ params }) {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) notFound();
  const price = priceLabel(v);
  const kidFit = kidFitInfo(v);
  const nearby = getVenuesByCity(citySlug(v.city)).filter((x) => x.slug !== slug).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    additionalType: 'https://schema.org/AmusementPark',
    name: v.name,
    description: `${primaryTag(v)} in ${v.city}, Ontario hosting kids birthday parties.`,
    url: `${SITE_URL}/venues/${v.slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: v.address.split(',')[0],
      addressLocality: v.city,
      addressRegion: 'ON',
      postalCode: v.postalCode,
      addressCountry: 'CA',
    },
    ...(v.phone ? { telephone: v.phone } : {}),
    ...(v.website ? { sameAs: v.website } : {}),
    ...(v.rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: v.rating,
            reviewCount: v.reviews,
          },
        }
      : {}),
    ...(v.lat && v.lng ? { geo: { '@type': 'GeoCoordinates', latitude: v.lat, longitude: v.lng } } : {}),
    ...(v.fromPrice
      ? {
          offers: {
            '@type': 'Offer',
            name: 'Birthday party package',
            price: String(v.fromPrice),
            priceCurrency: 'CAD',
            description: `Birthday party packages from $${v.fromPrice} CAD, as listed by the venue`,
            ...(v.website ? { url: v.website } : {}),
          },
        }
      : {}),
  };

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { label: 'Home', href: SITE_URL + '/' },
          { label: 'Venues by city', href: `${SITE_URL}/birthday-party-venues` },
          { label: v.city, href: `${SITE_URL}/birthday-party-venues/${citySlug(v.city)}` },
          { label: v.name },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="venue-detail">
        <p className="venue-meta">
          <span className="tag">{primaryTag(v)}</span>
          {v.tags.slice(1).map((t) => (
            <span className="tag tag-soft" key={t}>
              {t}
            </span>
          ))}
        </p>
        <h1>{v.name}</h1>
        <p className="venue-city">
          📍 {v.address}
          {v.rating ? (
            <span className="rating">
              {' '}
              ·{' '}
              <a href={v.mapsUrl} target="_blank" rel="noopener noreferrer">
                ★ {v.rating.toFixed(1)} ({v.reviews.toLocaleString('en-CA')} Google reviews)
              </a>
            </span>
          ) : null}
          {price ? <span> · {price}</span> : null}
        </p>
        {kidFit ? (
          <p className="kidfit-line">
            <KidFitMeter info={kidFit} />
          </p>
        ) : null}
        {v.partyDetails || v.fromPrice ? (
          <section className="party-box">
            <h2>Party package info</h2>
            {v.fromPrice ? <p className="party-from">Packages from ${v.fromPrice}</p> : null}
            {v.partyDetails ? <p>{v.partyDetails}</p> : null}
            {kidFit ? <p className="kidfit-note">🎈 {kidFit.title}.</p> : null}
          </section>
        ) : null}
        <section>
          <h2>Contact</h2>
          <ul className="contact-list">
            {v.phone ? (
              <li>
                📞 <a href={`tel:${v.phone}`}>{v.phone}</a>
              </li>
            ) : null}
            {v.website ? (
              <li>
                🌐 <a href={v.website} target="_blank" rel="noopener noreferrer nofollow">Visit website</a>
              </li>
            ) : null}
            <li>
              🗺️ <a href={v.mapsUrl} target="_blank" rel="noopener noreferrer nofollow">View on Google Maps</a>
            </li>
          </ul>
        </section>
      </article>
      {nearby.length ? (
        <section>
          <h2>More kids party venues in {v.city}</h2>
          <ul className="city-grid">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link href={`/venues/${n.slug}`}>{n.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
