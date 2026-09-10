import Link from 'next/link';

export default function SiteNav() {
  return (
    <div className="container nav-row">
      <Link href="/" className="brand">
        🎉 GTA Kids Parties
      </Link>
      <nav>
        <Link href="/birthday-party-venues">Venues by City</Link>
      </nav>
    </div>
  );
}
