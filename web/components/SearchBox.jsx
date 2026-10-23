'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

// Predefined quick-pick chips. Each fills the search box with its query; tapping the active chip clears it.
const QUICK_PICKS = [
  { label: 'Trampoline', q: 'trampoline' },
  { label: 'Laser tag', q: 'laser tag' },
  { label: 'Pottery', q: 'pottery' },
  { label: 'Toddler', q: 'toddler' },
  { label: 'Indoor playground', q: 'indoor playground' },
  { label: 'Entertainer', q: 'entertainer' },
  { label: 'Animals', q: 'animals' },
  { label: 'Cheap', q: 'cheap' },
  { label: 'Spa', q: 'spa' },
];

// Client-side search over the venue index (name, city, tags, idea keywords).
// The index is tiny (~81 rows) so it ships inline — no API needed, instant results.
export default function SearchBox({ index }) {
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');

  const cities = useMemo(() => [...new Set(index.map((v) => v.city))].sort(), [index]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    const out = [];
    for (const v of index) {
      if (city && v.city !== city) continue;
      const base = `${v.name} ${v.city} ${v.tags.join(' ')}`.toLowerCase();
      const ideas = v.ideas || [];
      const matches = terms.every((t) => base.includes(t) || ideas.some((i) => i.includes(t)));
      if (!matches) continue;
      // Show an idea label only when the query matched through an idea tag, not the venue's own text.
      const viaIdea = !terms.every((t) => base.includes(t));
      const idea = viaIdea
        ? ideas.find((i) => i.includes(query)) || ideas.find((i) => terms.some((t) => i.includes(t)))
        : null;
      out.push({ v, idea });
      if (out.length === 25) break;
    }
    return out;
  }, [q, city, index]);

  return (
    <div className="searchbox">
      <div className="search-controls">
        <input
          type="search"
          placeholder="Search: trampoline, pottery, toddler, Vaughan…"
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
      <div className="quick-picks" role="group" aria-label="Quick picks">
        {QUICK_PICKS.map((p) => {
          const active = q.trim().toLowerCase() === p.q;
          return (
            <button
              key={p.q}
              type="button"
              className="quick-pick"
              aria-pressed={active}
              onClick={() => setQ(active ? '' : p.q)}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <ul className="search-results">
        {results.map(({ v, idea }) => (
          <li key={v.slug}>
            <Link href={`/venues/${v.slug}`}>
              <strong>{v.name}</strong>
              <span>
                {' '}
                — {v.city} · {v.tags[0]}
                {idea ? ` · ${idea}` : ''}
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
