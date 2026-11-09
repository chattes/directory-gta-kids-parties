import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

export const metadata = {
  title: 'Privacy',
  description:
    'How Toronto Birthday Parties uses cookies and third-party advertising, including Google AdSense.',
};

export default function PrivacyPage() {
  return (
    <div className="container">
      <article className="venue-detail">
        <h1>Privacy</h1>
        <p className="lede">
          This page explains how {SITE_NAME} uses cookies and third-party advertising.
        </p>

        <section>
          <h2>Advertising and cookies</h2>
          <p>
            This site shows ads served by Google AdSense. Google and its partners may use cookies
            to show ads based on your prior visits to this site and to other sites on the internet.
            You can learn how Google uses data in ads at{' '}
            <a href="https://policies.google.com/technologies/ads" rel="noopener noreferrer">
              policies.google.com/technologies/ads
            </a>
            . You can turn off personalised ads in your Google Ads Settings at{' '}
            <a href="https://adssettings.google.com" rel="noopener noreferrer">
              adssettings.google.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Analytics</h2>
          <p>
            The site uses analytics tools to count page visits and see which pages are read. These
            tools report aggregate traffic and do not identify you by name.
          </p>
        </section>

        <section>
          <h2>Questions</h2>
          <p>
            For privacy questions, use the <Link href="/contact">contact form</Link> or email{' '}
            <a href="mailto:feedback@torontobirthdayparties.com">feedback@torontobirthdayparties.com</a>.
          </p>
        </section>
      </article>
    </div>
  );
}
