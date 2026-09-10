import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import VenueCard from '@/components/VenueCard';
import { venues, cities } from '@/lib/venues';
import { SITE_URL, SITE_NAME } from '@/lib/site';

export default function HomePage() {
  const index = venues.map((v) => ({
    slug: v.slug,
    name: v.name,
    city: v.city,
    tags: v.tags,
    rating: v.rating,
  }));
  const featured = venues.slice(0, 9);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero">
        <h1>Kids Birthday Party Venues Across the GTA</h1>
        <p>
          A hand-curated directory of {venues.length} indoor playgrounds, trampoline parks, party
          venues and kids entertainers across Toronto, Mississauga, Scarborough, Vaughan and more —
          every listing verified for birthday party packages.
        </p>
        <SearchBox index={index} />
      </section>

      <section>
        <h2>Browse by city</h2>
        <ul className="city-grid">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link href={`/birthday-party-venues/${c.slug}`}>
                Kids party venues in {c.name} <span className="count">({c.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Popular venues</h2>
        <div className="card-grid">
          {featured.map((v) => (
            <VenueCard key={v.slug} venue={v} />
          ))}
        </div>
      </section>
    </div>
  );
}
