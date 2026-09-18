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
  verification: {
    // `pinterest` is not a supported key here — it renders nothing. Use `other`
    // so the tag actually makes it into <head>.
    other: { 'pinterest-verification': 'd1f57e728cb44062107f8ec72f669df4' },
  },
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
              <Link href="/birthday-party-venues">Browse by city</Link> ·{' '}
              <a href="/sitemap.xml">Sitemap</a>
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
