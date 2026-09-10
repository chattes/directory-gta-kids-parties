import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <h1>Page not found</h1>
      <p>
        Try <Link href="/">browsing all venues</Link> or{' '}
        <Link href="/birthday-party-venues">searching by city</Link>.
      </p>
    </div>
  );
}
