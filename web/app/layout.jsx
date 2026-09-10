import './globals.css';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import { SITE_URL, SITE_NAME } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GTA Kids Parties — Kids Birthday Party Venues Across the GTA',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'A curated directory of kids birthday party venues across the Greater Toronto Area — indoor playgrounds, trampoline parks, party services and more, searchable by city.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-CA">
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
      </body>
    </html>
  );
}
