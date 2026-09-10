import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'Contact — Feedback & List Your Business',
  description:
    'Contact Toronto Birthday Parties — send feedback and suggestions, or list your kids party venue in our GTA directory.',
  alternates: { canonical: `${SITE_URL}/contact` },
};

const EMAIL = 'feedback@torontobirthdayparties.com';

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Toronto Birthday Parties',
    url: `${SITE_URL}/contact`,
  };
  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1>Contact Us</h1>
      <p className="lede">
        Toronto Birthday Parties is a hand-curated directory of kids party venues across the GTA.
        We read every message.
      </p>

      <section className="party-box">
        <h2>🎉 List your business</h2>
        <p>
          Run an indoor playground, trampoline park, party venue, or kids entertainment service in
          the GTA? We&apos;re always adding verified venues. Send us your business name, address,
          website, and what your birthday party packages include — we&apos;ll review and add your
          listing.
        </p>
        <p>
          <a className="cta" href={`mailto:${EMAIL}?subject=List%20my%20business%20-%20venue%20listing`}>
            Apply for a listing →
          </a>
        </p>
      </section>

      <section>
        <h2>💬 Feedback & suggestions</h2>
        <p>
          Spotted outdated info (a venue that closed, wrong phone number)? Got an idea to make the
          directory more useful? Tell us — corrections keep the list trustworthy.
        </p>
        <p>
          <a className="cta" href={`mailto:${EMAIL}?subject=Feedback%20-%20torontobirthdayparties.com`}>
            Send feedback →
          </a>
        </p>
      </section>

      <section>
        <h2>Everything else</h2>
        <p>
          Direct email:{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </section>
    </div>
  );
}
