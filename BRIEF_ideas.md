# Brief: "Birthday party ideas in <city>" guide pages + ranked city sections (branch refresh-2026-10)

Start ONLY after the data refresh is done (data/venues.csv has `summary`, `overview`, `last_verified` columns, REFRESH_REPORT.md exists). Read: PLAYBOOK.md, research_kw/KEYWORDS_best_venues.md (keyword research), REFRESH_REPORT.md, web/app/birthday-party-venues/[city]/page.jsx and web/app/venues/[slug]/page.jsx (match their style, components, schema and metadata patterns), web/lib/venues.js, web/lib/util.js.

## Build
1. New route `web/app/birthday-party-ideas/[city]/page.jsx`, statically generated for Toronto, Mississauga, Vaughan, Whitby (only cities with search volume per the keyword file). Title/H1 pattern: "Birthday Party Ideas in <City> (<Month Year>)" style is fine only if the date is the real last-verified month. Target keywords: "birthday party ideas <city>", plus "kids birthday party places <city>", "indoor birthday party <city>".
   - Ideas grouped by activity type, derived from venue `categories` in the data (e.g. trampoline park, go-karts, pottery/painting/art, cooking, science, laser tag, animals/reptiles, play café/indoor playground for toddlers, climbing, bowling, swimming — only groups that have at least 1 real venue in that city; Toronto/North York/Scarborough/East York/Etobicoke count as Toronto if the site already groups them that way — check how city pages group them and stay consistent).
   - Each idea: 2-3 sentences on what that kind of party is like and who it suits (general, true, no invented stats), then the venues in that city: name (link to /venues/<slug>/), summary, ages/duration/from-price ONLY when present in data, kid-fit meter if the site shows it.
   - "By age" section: toddlers (1-4), kids (5-9), tweens/teens (10+) — map venues only when the data supports the age (party_details/overview); otherwise do not assign.
   - FAQ (5-7 Qs) answering the People Also Ask questions in the keyword file, with answers built from our data (counts, price ranges computed from data, not typed). FAQPage JSON-LD + ItemList JSON-LD of venues + BreadcrumbList, matching existing schema patterns.
   - "Last checked <date>" from the max/min `last_verified` in that city's rows.
   - "How we pick venues" short block (the real criteria: Google rating/reviews, kid-review signal, verified party page, red-flag review check) linking to /about/.
2. Existing city pages `/birthday-party-venues/<city>/` for Toronto, Mississauga, Vaughan: add a ranked "Top picks" section (top 5 by a documented score: rating weighted by review count + kid_fit; show the criteria on the page), each with the 1-sentence summary, and a link to that city's ideas page. Brampton city page: add a "Cheaper options" section (venues with the lowest verified from_price or price_bucket), only from data.
3. Venue pages: show `overview` (and `summary` as meta description if better than the current one) when present; hide the block when empty.
4. Internal links: home page + nav/footer link to the ideas pages; each ideas page links to the city page and back.
5. Update sitemap, `node scripts/gen-llms.mjs` (and llms.txt/ai json if they list page types), RSS if relevant.
6. Writing: plain, specific, human. Banned: "nestled", "vibrant", "look no further", "perfect for", "whether you're", "unforgettable", "delve". No invented facts, no prices or ages not in the data. Each ideas page must be substantially unique (no copied paragraphs between cities).

## Rules
- Mobile-first: no horizontal scroll at 360px, tap targets >= 44px.
- `cd web && npm run build` passes; lint if configured. No dev server left running.
- Do NOT deploy, do NOT push.
- No parallel subagent swarms. Commit in logical steps. Progress notes in PROGRESS_ideas.md. Print DONE when finished.
