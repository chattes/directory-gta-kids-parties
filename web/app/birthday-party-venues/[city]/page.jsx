import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import VenueCard from '@/components/VenueCard';
import { cities, getVenuesByCity } from '@/lib/venues';
import { citySlug } from '@/lib/util';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const c = cities.find((x) => x.slug === city);
  if (!c) return {};
  const name = c.name;
  return {
    title: `Kids Birthday Party Venues in ${name} (${c.count} Curated)`,
    description: `The best kids birthday party venues in ${name}, Ontario — indoor playgrounds, trampoline parks and party spaces with verified birthday packages. Compare and contact venues directly.`,
    alternates: { canonical: `${SITE_URL}/birthday-party-venues/${city}` },
  };
}

export default async function CityPage({ params }) {
  const { city } = await params;
  const c = cities.find((x) => x.slug === city);
  if (!c) notFound();
  const list = getVenuesByCity(city);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Kids birthday party venues in ${c.name}`,
    itemListElement: list.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/venues/${v.slug}`,
      name: v.name,
    })),
  };

  const others = cities.filter((x) => x.slug !== city).slice(0, 8);

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { label: 'Home', href: SITE_URL + '/' },
          { label: 'Venues by city', href: `${SITE_URL}/birthday-party-venues` },
          { label: c.name },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1>Kids Birthday Party Venues in {c.name}</h1>
      <p className="lede">
        {list.length} curated kids party venues in {c.name}, Ontario. Every listing has been
        checked for real birthday party packages — browse, compare, and contact the venue directly.
      </p>
      <div className="card-grid">
        {list.map((v) => (
          <VenueCard key={v.slug} venue={v} />
        ))}
      </div>
      <section>
        <h2>Other GTA cities</h2>
        <ul className="city-grid">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/birthday-party-venues/${o.slug}`}>
                Kids party venues in {o.name} <span className="count">({o.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
