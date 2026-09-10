import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  // items: [{ href?, label }]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: it.href } : {}),
    })),
  };
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {items.map((it, i) => (
          <span key={i}>
            {i > 0 && <span className="crumb-sep"> › </span>}
            {it.href ? <Link href={it.href}>{it.label}</Link> : <span>{it.label}</span>}
          </span>
        ))}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
