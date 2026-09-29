import './globals.css';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import SiteNav from '@/components/SiteNav';
import { SITE_URL, SITE_NAME } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Toronto Birthday Parties — Kids Party Venues Across the GTA',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'A curated directory of kids birthday party venues across the Greater Toronto Area — indoor playgrounds, trampoline parks, party services and more, searchable by city.',
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: SITE_NAME,
    title: 'Toronto Birthday Parties — Kids Party Venues Across the GTA',
    description:
      '92 hand-curated kids birthday party venues across the GTA — verified party packages, ratings and pricing, searchable by city.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  verification: {
    // `pinterest` is not a supported key here — it renders nothing. Use `other`
    // so the tag actually makes it into <head>.
    other: { 'pinterest-verification': 'd1f57e728cb44062107f8ec72f669df4' },
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  description:
    'A hand-curated directory of kids birthday party venues across the Greater Toronto Area, verified for real party packages.',
  email: 'feedback@torontobirthdayparties.com',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'feedback@torontobirthdayparties.com',
    contactType: 'customer support',
    areaServed: 'CA',
    availableLanguage: ['en', 'fr'],
  },
  sameAs: ['https://ca.pinterest.com/chatteswork/kids-birthday-party-venues-gta/'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-CA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Nunito:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <header className="site-header">
          <SiteNav />
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>
              {SITE_NAME} — a hand-curated directory. Confirm party package details with each venue
              before booking.
            </p>
            <p>
              <Link href="/birthday-party-venues">Browse by city</Link> · <Link href="/about">About</Link> ·{' '}
              <a href="/sitemap.xml">Sitemap</a> · <a href="/feed.xml">RSS</a>
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
