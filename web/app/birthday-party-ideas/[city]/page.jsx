import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import KidFitMeter from '@/components/KidFitMeter';
import { cities, kidFitInfo, rankPicks, displayName } from '@/lib/venues';
import { IDEA_CITIES, ideaGroups, ideaVenues, ideaAreas, cityFacts, ageVenues, AGE_BANDS } from '@/lib/ideas';
import { SITE_URL } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return IDEA_CITIES.map((city) => ({ city }));
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function getCity(slug) {
  if (!IDEA_CITIES.includes(slug)) return null;
  return cities.find((c) => c.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  const f = cityFacts(city);
  return {
    title: `Birthday Party Ideas in ${c.name} (${f.monthYear})`,
    description: `Birthday party ideas in ${c.name}, Ontario, grouped by activity and age. ${plural(
      f.count,
      'venue',
      'venues'
    )} with party details, last checked ${f.lastLabel}.`,
    alternates: { canonical: `${SITE_URL}/birthday-party-ideas/${city}` },
  };
}

function buildFaqs(name, city, facts, groups) {
  const faqs = [];
  const { priced } = facts;
  if (priced.length) {
    const lo = priced[0];
    const hi = priced[priced.length - 1];
    faqs.push({
      q: `How much does a birthday party cost in ${name}?`,
      a: `${plural(priced.length, 'venue', 'venues')} of ${facts.count} in ${name} publish a package price, from $${lo.fromPrice} at ${displayName(lo.name)} to $${hi.fromPrice} at ${displayName(hi.name)}. Prices can change, so confirm with the venue before you book.`,
    });
  }
  faqs.push({
    q: `What kinds of birthday parties can you book in ${name}?`,
    a: `We list ${plural(facts.count, 'venue', 'venues')} in ${name} across ${plural(
      groups.length,
      'activity type',
      'activity types'
    )}: ${groups.map((g) => g.title).join('; ')}.`,
  });
  const top = rankPicks(ideaVenues(city), 3);
  if (top.length) {
    faqs.push({
      q: `Which birthday party venue in ${name} is the best for kids?`,
      a: `By our score, the top three in ${name} are ${top.map((v) => displayName(v.name)).join(', ')}. The score combines Google rating, review count and kid-fit. The full ranking is on the ${name} venues page.`,
    });
  }
  if (facts.sizes.length) {
    const small = facts.sizes[0];
    const big = facts.sizes[facts.sizes.length - 1];
    faqs.push({
      q: `How many kids can come to a birthday party in ${name}?`,
      a: `Venues that state a group size allow between ${small.n} kids (${displayName(small.v.name)}) and ${big.n} kids (${displayName(big.v.name)}). Venues that do not state a limit are not counted here, so ask the venue directly.`,
    });
  }
  const toddlers = ageVenues(city, 'toddlers');
  faqs.push({
    q: `Which venues in ${name} take toddlers?`,
    a: toddlers.length
      ? `${plural(toddlers.length, 'venue', 'venues')} in ${name} state an age range that includes toddlers: ${toddlers
          .map((v) => displayName(v.name))
          .join(', ')}. Venues without a stated age range are not listed under toddlers.`
      : `None of the ${name} venues in our list state an age range that includes toddlers. Ask the venue before booking for a toddler.`,
  });
  faqs.push({
    q: `Are there indoor birthday party places in ${name}?`,
    a: `Yes. ${facts.indoorCount} of the ${facts.count} venues in ${name} are indoor playgrounds, gyms, trampoline or climbing centres, bowling, laser tag, VR or arcades.`,
  });
  faqs.push({
    q: `How current is the information for ${name}?`,
    a: `The ${name} listings were last checked on ${facts.lastLabel}. Each venue page shows its own last-checked date.`,
  });
  return faqs;
}

export default async function IdeasPage({ params }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();
  const { name } = c;
  const groups = ideaGroups(city);
  const facts = cityFacts(city);
  const faqs = buildFaqs(name, city, facts, groups);
  const others = IDEA_CITIES.filter((x) => x !== city);
  const areas = ideaAreas(city);
  const showArea = areas.length > 1;
  const areaTag = (v) => (showArea ? <span className="tag tag-soft">{v.city}</span> : null);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const list = ideaVenues(city);
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Birthday party venues in ${name}`,
    itemListElement: list.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/venues/${v.slug}`,
      name: displayName(v.name),
    })),
  };

  const priced = facts.priced.length;

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { label: 'Home', href: SITE_URL + '/' },
          { label: 'Venues by city', href: `${SITE_URL}/birthday-party-venues` },
          { label: name, href: `${SITE_URL}/birthday-party-venues/${city}` },
          { label: 'Party ideas' },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <h1>Birthday Party Ideas in {name} ({facts.monthYear})</h1>
      <p className="lede">
        {plural(facts.count, 'venue', 'venues')} in {name} across {plural(groups.length, 'kind', 'kinds')} of
        party. {priced} of them publish a package price
        {priced ? `, from $${facts.priced[0].fromPrice} to $${facts.priced[priced - 1].fromPrice}` : ''}. Last checked{' '}
        {facts.lastLabel}.
      </p>
      <p>
        <Link className="btn btn-sun" href={`/birthday-party-venues/${city}`}>
          Compare venues in {name}
        </Link>
        {city === 'toronto' && (
          <>
            {' '}Also see{' '}
            <Link href="/birthday-party-venues/north-york">North York</Link>,{' '}
            <Link href="/birthday-party-venues/scarborough">Scarborough</Link> and{' '}
            <Link href="/birthday-party-venues/east-york">East York</Link>.
          </>
        )}
      </p>

      <section>
        <h2>Ideas by activity</h2>
        {groups.map((g) => (
          <div className="idea-group" key={g.id}>
            <h3>{g.title}</h3>
            <p>{g.blurb}</p>
            <p className="idea-count">
              In {name}: {plural(g.venues.length, 'venue', 'venues')}.
            </p>
            <ul className="idea-list">
              {g.venues.map((v) => {
                const kf = kidFitInfo(v);
                return (
                  <li key={v.slug} className="idea-item">
                    <Link href={`/venues/${v.slug}`}>{displayName(v.name)}</Link>
                    {areaTag(v)}
                    {v.summary ? <p>{v.summary}</p> : null}
                    <p className="idea-facts">
                      {v.fromPrice ? <span className="tag tag-price">from ${v.fromPrice}</span> : null}
                      {v.partyDetails ? <span> Party details: {v.partyDetails}.</span> : null}
                    </p>
                    {kf ? (
                      <p className="kidfit-line">
                        <KidFitMeter info={kf} />
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Ideas by age</h2>
        <p>
          A venue appears under an age only when its own listing states an age range or age wording that covers it.
        </p>
        {AGE_BANDS.map((b) => {
          const vs = ageVenues(city, b.id);
          return (
            <div className="idea-group" key={b.id}>
              <h3>{b.title}</h3>
              {vs.length ? (
                <ul className="idea-list">
                  {vs.map((v) => (
                    <li key={v.slug} className="idea-item">
                      <Link href={`/venues/${v.slug}`}>{displayName(v.name)}</Link>
                      {areaTag(v)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="idea-count">No {name} venue in our list states an age range for this group.</p>
              )}
            </div>
          );
        })}
      </section>

      <section>
        <h2>How we pick venues</h2>
        <p>
          Each venue is ranked on checks we can repeat: its Google rating and review count, the share of its
          reviews that mention kids, whether it publishes a party page we could read, and a check for repeated
          complaints in recent reviews. Venues with repeated complaints are flagged and reviewed by hand. Read
          more on the <Link href="/about">about page</Link>.
        </p>
      </section>

      <section>
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <h2>Other cities</h2>
        <ul className="city-grid">
          {others.map((o) => {
            const oc = getCity(o);
            return oc ? (
              <li key={o}>
                <Link href={`/birthday-party-ideas/${o}`}>Party ideas in {oc.name}</Link>
              </li>
            ) : null;
          })}
        </ul>
      </section>
    </div>
  );
}
