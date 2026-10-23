# PROGRESS ideas

- [x] Data: build_data.py exports summary, overview, lastVerified; venues.json rebuilt (existing fields unchanged).
- [x] Ideas pages: /birthday-party-ideas/{toronto,mississauga,vaughan,whitby} (lib/ideas.js holds groups, age evidence, facts).
- [x] City pages: Top picks (Toronto, Mississauga, Vaughan; score = rating x log10(reviews+1) + kid-fit); Cheaper options (Brampton); link to ideas page.
- [x] Venue pages: overview block, last-checked date, summary used as meta description.
- [x] Home section, footer link, sitemap, llms.txt index, ai/summary.json.
- [x] npm run build passes (no lint script configured).
- [x] Screenshots (mobile 390, desktop) in shots_ideas/ (ideas Toronto, city Toronto); no horizontal scroll at 360 or 390px; server stopped..
- Notes: Toronto ideas use city == "Toronto" only, matching how city pages group venues (North York, Scarborough, East York are separate city pages). Nav not changed (crowded at 360px). RSS not changed (venue-only feed). Keyword file lists no PAA question text, so FAQ questions follow the target keyword phrasing.
