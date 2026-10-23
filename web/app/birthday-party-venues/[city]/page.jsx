import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import VenueCard from '@/components/VenueCard';
import { cities, getVenuesByCity, topPicks, venueScore, kidFitInfo, displayName } from '@/lib/venues';
import KidFitMeter from '@/components/KidFitMeter';
import { IDEA_CITIES } from '@/lib/ideas';
import { citySlug } from '@/lib/util';
import { SITE_URL } from '@/lib/site';

const TOP_PICK_CITIES = ['toronto', 'mississauga', 'vaughan'];
const CHEAP_CITIES = ['brampton'];

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
      {TOP_PICK_CITIES.includes(city) ? (
        <section>
          <h2>Top picks in {c.name}</h2>
          <p>
            Only venues rated 3 or more on our 1 to 5 kid-fit scale qualify. They are ranked by Google rating
            multiplied by the log of the review count, plus twice the kid-fit rating. The log means a 4.8 with 2,000
            reviews counts for more than a 5.0 with 3 reviews.
          </p>
          <ol className="pick-list">
            {topPicks(city, 5).map((v) => {
              const kf = kidFitInfo(v);
              return (
                <li key={v.slug} className="pick-item">
                  <Link href={`/venues/${v.slug}`}>{displayName(v.name)}</Link>
                  <span className="pick-score">
                    {' '}
                    ★ {v.rating.toFixed(1)} ({v.reviews.toLocaleString('en-CA')} reviews) · score {venueScore(v).toFixed(1)}
                  </span>
                  {v.summary ? <p>{v.summary}</p> : null}
                  {kf ? (
                    <p className="kidfit-line">
                      <KidFitMeter info={kf} />
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
      {CHEAP_CITIES.includes(city) ? (
        <section>
          <h2>Cheaper options in {c.name}</h2>
          {(() => {
            const priced = list.filter((v) => v.fromPrice).sort((a, b) => a.fromPrice - b.fromPrice);
            const perChild = list.filter((v) => !v.fromPrice && /per child/i.test(v.partyDetails || ''));
            return (
              <>
                <p>
                  {priced.length} of {list.length} {c.name} venues publish a package price. They are listed from
                  lowest to highest. Venues without a published price are not ranked here.
                </p>
                <ol className="pick-list">
                  {priced.map((v) => (
                    <li key={v.slug} className="pick-item">
                      <Link href={`/venues/${v.slug}`}>{displayName(v.name)}</Link>
                      <span className="pick-score"> from ${v.fromPrice}</span>
                      {v.partyDetails ? <p>{v.partyDetails}.</p> : null}
                    </li>
                  ))}
                </ol>
                {perChild.length ? (
                  <>
                    <h3>Priced per child</h3>
                    <ul className="pick-list">
                      {perChild.map((v) => (
                        <li key={v.slug} className="pick-item">
                          <Link href={`/venues/${v.slug}`}>{displayName(v.name)}</Link>
                          <p>{v.partyDetails}.</p>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </>
            );
          })()}
        </section>
      ) : null}
      {IDEA_CITIES.includes(city) ? (
        <p>
          <Link href={`/birthday-party-ideas/${city}`}>Birthday party ideas in {c.name}, by activity and age</Link>
        </p>
      ) : null}
      <h2>All {c.name} venues</h2>
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
                Party venues in {o.name} <span className="count">({o.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
