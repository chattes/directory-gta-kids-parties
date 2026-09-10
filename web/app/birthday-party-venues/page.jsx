import Link from 'next/link';
import { cities } from '@/lib/venues';

export const metadata = {
  title: 'Kids Birthday Party Venues by City',
  description:
    'Browse kids birthday party venues across every GTA city — Toronto, Mississauga, Scarborough, Vaughan, Brampton, Markham and more.',
};

export default function CityIndexPage() {
  return (
    <div className="container">
      <h1>Kids Birthday Party Venues by City</h1>
      <ul className="city-grid">
        {cities.map((c) => (
          <li key={c.slug}>
            <Link href={`/birthday-party-venues/${c.slug}`}>
              {c.name} <span className="count">({c.count} venues)</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
