import Script from 'next/script';

// Self-hosted Umami on the Hostinger VPS; the website ID is public.
// data-domains keeps local/preview builds out of stats.
export default function UmamiAnalytics() {
  return (
    <Script
      src="https://stats.ehbudgettravels.com/script.js"
      data-website-id="b26518fd-2e62-4c3f-95de-0cac783114e0"
      data-domains="torontobirthdayparties.com,www.torontobirthdayparties.com"
      strategy="afterInteractive"
    />
  );
}
