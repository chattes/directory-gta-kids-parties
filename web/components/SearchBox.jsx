'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

// Client-side search over the venue index (name, city, tags).
// The index is tiny (~81 rows) so it ships inline — no API needed, instant results.
export default function SearchBox({ index }) {
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');

  const cities = useMemo(() => [...new Set(index.map((v) => v.city))].sort(), [index]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return index
      .filter((v) => (city ? v.city === city : true))
      .filter((v) =>
        terms.every((t) =>
          `${v.name} ${v.city} ${v.tags.join(' ')}`.toLowerCase().includes(t)
        )
      )
      .slice(0, 25);
  }, [q, city, index]);

  return (
    <div className="searchbox">
      <div className="search-controls">
        <input
          type="search"
          placeholder="Search venues, e.g. trampoline, playground, Vaughan…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search kids party venues"
          autoComplete="off"
        />
        <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="Filter by city">
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <ul className="search-results">
        {results.map((v) => (
          <li key={v.slug}>
            <Link href={`/venues/${v.slug}`}>
              <strong>{v.name}</strong>
              <span>
                {' '}
                — {v.city} · {v.tags[0]}
                {v.rating ? ` · ★ ${v.rating.toFixed(1)}` : ''}
              </span>
            </Link>
          </li>
        ))}
        {results.length === 0 && <li className="no-results">No venues match — try another term.</li>}
      </ul>
    </div>
  );
}
