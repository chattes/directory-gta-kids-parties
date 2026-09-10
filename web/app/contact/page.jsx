import ContactForm from '@/components/ContactForm';
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
        <ContactForm />
      </section>

      <section>
        <h2>What happens when you list your business?</h2>
        <p>
          Send us your business name, address, website, and what your birthday party packages
          include. We review every submission by hand — if it&apos;s a genuine kids party venue in
          the GTA, we add it to the directory. Premium placement (photos, direct links, featured
          spots) is coming soon.
        </p>
        <p>
          Prefer plain email? Reach us at{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </section>
    </div>
  );
}
