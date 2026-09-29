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

  const faqs = [
    {
      q: 'What is Toronto Birthday Parties?',
      a: `A hand-curated directory of ${venues.length} kids birthday party venues across the Greater Toronto Area — indoor playgrounds, trampoline parks, laser tag, amusement centres, VR arcades and children's entertainers — searchable by city.`,
    },
    {
      q: 'How are venues verified?',
      a: 'Each venue\u2019s website is crawled for real birthday party packages and its Google reviews are analysed, including the share of recent reviews mentioning kids. Venues with verifiable party packages get listed; listings that can no longer be verified are removed in a monthly re-check.',
    },
    {
      q: 'Is it free to use?',
      a: 'Yes — free for parents searching for a venue, and free for venues to be listed. Venues can be added, updated or removed via the contact page.',
    },
    {
      q: 'Which cities are covered?',
      a: `All 14 GTA cities with curated listings: ${cities
        .slice(0, 8)
        .map((c) => c.name)
        .join(', ')} and more, each with its own page.`,
    },
    {
      q: 'Does the site take bookings?',
      a: 'No. The directory links you directly to each venue\u2019s own website, phone number and Google Maps listing so you can book directly.',
    },
    {
      q: 'How can a venue owner list their business?',
      a: 'Use the contact page or email feedback@torontobirthdayparties.com — listing, updates and removals are all free.',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero">
        <p className="curated-badge">✋ Hand-curated by a human</p>
        <h1>
          Kids <span className="mark">Birthday Party</span> Venues Across the GTA
        </h1>
        <p className="lede">
          A hand-curated directory of {venues.length} indoor playgrounds, trampoline parks, party
          venues and children's entertainers across Toronto, Mississauga, Scarborough, Vaughan and
          more — every listing verified for birthday party packages.
        </p>
        <SearchBox index={index} />
      </section>

      <section className="types" aria-label="Kinds of party venues">
        <div className="container">
          <ul>
            <li>Indoor playgrounds</li>
            <li>Trampoline parks</li>
            <li>Laser tag</li>
            <li>Amusement centres</li>
            <li>VR arcades</li>
            <li>Children's entertainers</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Browse by city</h2>
        <ul className="city-grid">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link href={`/birthday-party-venues/${c.slug}`}>
                Birthday party venues in {c.name} <span className="count">({c.count})</span>
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

      <section>
        <h2>Frequently asked questions</h2>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
