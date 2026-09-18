import Link from 'next/link';

const BALLOON_LOGO = (
  <svg width="34" height="41" viewBox="0 0 40 48" aria-hidden="true">
    <ellipse cx="20" cy="19" rx="15" ry="17" fill="#FF5C4D" stroke="#22174B" strokeWidth="3" />
    <path d="M15 35l5-1 5 1-5 8z" fill="#FF5C4D" stroke="#22174B" strokeWidth="3" strokeLinejoin="round" />
    <path d="M12 13q2-6 8-7" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export default function SiteNav() {
  return (
    <div className="container nav-row">
      <Link href="/" className="brand">
        {BALLOON_LOGO}
        <span>Toronto Birthday Parties</span>
      </Link>
      <nav>
        <Link href="/birthday-party-venues">Venues by City</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/birthday-party-venues" className="btn btn-sun nav-cta">
          Find a venue
        </Link>
      </nav>
    </div>
  );
}
