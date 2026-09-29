import Link from 'next/link';
import { venues, cities } from '@/lib/venues';
import { SITE_NAME } from '@/lib/site';

export const metadata = {
  title: 'About',
  description:
    'Who curates Toronto Birthday Parties, how venues are verified, and how to list, update or remove a venue.',
};

export default function AboutPage() {
  return (
    <div className="container">
      <article className="venue-detail">
        <h1>About {SITE_NAME}</h1>
        <p className="lede">
          {SITE_NAME} is an independently curated directory of {venues.length} kids birthday party
          venues across {cities.length} GTA cities — built and maintained by one person who kept a
          spreadsheet for every party they planned, and decided the whole city deserved it.
        </p>

        <section>
          <h2>How venues are chosen</h2>
          <p>
            Every listing starts with a real venue that publicly offers birthday party packages.
            Each candidate is crawled to confirm the packages still exist, and its Google reviews
            are analysed — including the share of recent reviews that mention kids — before it goes
            live. That review signal also feeds the kid-fit balloon score on each listing, so the
            rating shows its work.
          </p>
          <p>
            Listings are re-verified monthly. A venue whose party pages disappear or whose site can
            no longer be reached is removed rather than left to rot.
          </p>
        </section>

        <section>
          <h2>How the site makes money</h2>
          <p>
            It doesn&apos;t, yet. There are no sponsored placements and no affiliate links, and
            listing positions follow the data — ratings first, not payments. If venues ever pay for
            anything, it will be clearly labelled and never affect ranking.
          </p>
        </section>

        <section>
          <h2>For venue owners</h2>
          <p>
            Being listed is free. To add your venue, update its details, or ask for removal, use the{' '}
            <Link href="/contact">contact form</Link> or email{' '}
            <a href="mailto:feedback@torontobirthdayparties.com">feedback@torontobirthdayparties.com</a>.
          </p>
        </section>

        <section>
          <h2>AI and data use</h2>
          <p>
            The catalogue is maintained with the help of automated crawlers, and the site publishes
            machine-readable indexes (<a href="/llms.txt">llms.txt</a>,{' '}
            <a href="/llms-full.txt">llms-full.txt</a>) so AI search engines can quote and cite
            accurate, current venue information. Bulk re-publication of the catalogue itself is not
            permitted.
          </p>
        </section>
      </article>
    </div>
  );
}
