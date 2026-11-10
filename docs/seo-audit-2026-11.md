# SEO audit — programmatic templates — 2026-11-09

Scope: the city hub template (`web/app/birthday-party-venues/[city]/page.jsx`) and the
ideas template (`web/app/birthday-party-ideas/[city]/page.jsx`), audited against the
programmatic-seo checklist (unique value per page, title/meta, H1, internal links,
schema, canonical, thin/duplicate risk).

Indexing context: 114 of 141 sitemap URLs indexed. Not indexed:
`/birthday-party-venues/toronto` and `/whitby` (Discovered, not indexed) and
`/birthday-party-venues/mississauga` (Crawled, not indexed — thin/duplicate signal),
plus ~24 venue pages, mostly new.

## What is already correct

- Canonicals are absolute `https://www.torontobirthdayparties.com` URLs on hubs,
  ideas pages and venue pages (single source in `lib/site.js`).
- One H1 per page on both templates; H1 contains the primary keyword + city.
- Unique title and meta description per city on both templates (city name and
  live venue count are interpolated).
- BreadcrumbList JSON-LD on every page via `components/Breadcrumbs.jsx`;
  ItemList JSON-LD on both templates; FAQPage JSON-LD on ideas pages (valid: the
  questions and answers are rendered visibly in `<details>` elements).
- Venue pages carry LocalBusiness JSON-LD with real data only.
- Sitemap is generated from the same data as the pages, so it cannot drift.

## Findings

### 1. City hubs have no unique content outside 3 hard-coded cities (High)
`TOP_PICK_CITIES = ['toronto', 'mississauga', 'vaughan']` and
`CHEAP_CITIES = ['brampton']` gate the only data-driven sections. Every other hub
(Aurora, Markham, Oakville, Whitby, Scarborough, …) renders the same templated lede
plus venue cards and an identical "Other GTA cities" block — near-duplicate doorway
pages. This matches the Whitby hub being "Discovered, not indexed".
Fix: generalize the top-picks and price sections to any city with enough qualifying
data, and add a per-city stats section computed from real venue rows.

### 2. Hub lede is a swapped-variable sentence on every page (High)
"{n} curated kids party venues in {name}…" is identical boilerplate across all hubs.
For Mississauga (Crawled, not indexed, thin/duplicate) the added top-picks section
helps but the surrounding copy is still template text.
Fix: extend the lede with computed per-city facts (price range, activity mix,
review totals) so each page's first 100 words differ meaningfully.

### 3. Demand pages missing: ideas pages for Oakville, Markham, Brampton (High)
GSC shows searches for "birthday party ideas" in Oakville, Markham and Brampton
(20–50/month each) but `/birthday-party-ideas/<city>` 404s for them. Pickering and
Woodbridge also appear in GSC. Data check 2026-11-09: Oakville 7 venues, Markham 5,
Brampton 5, Pickering 3, Woodbridge 2.
Fix: add ideas pages for oakville, markham, brampton, pickering (≥3 real venues
each). Woodbridge stays out — only 2 venues, below the minimum for a useful page.

### 4. Weak cross-linking between hubs and ideas pages (Medium)
Hubs link to their ideas page only for the 4 existing IDEA_CITIES; ideas pages link
back, but there are no nearby-city links (e.g. Mississauga ↔ Oakville ↔ Brampton),
which limits crawl paths to the not-yet-indexed venue pages.
Fix: hub ↔ ideas links follow automatically from IDEA_CITIES; add a data-driven
nearby-cities block on both templates, and keep venue links on ideas pages (each
activity/age row links to the venue page).

### 5. Minor: footer links only to the Toronto ideas page (Low)
`/birthday-party-ideas/toronto` is the only ideas page in the footer. Left as-is to
avoid inflating boilerplate; the new "Other cities" sections cover discovery.

## Changes shipped in this branch

- `lib/venues.js`: added `cityStats(slug)` (count, price range, priced count,
  average rating, total reviews, top activity tags) and `NEARBY_CITIES` map.
- `birthday-party-venues/[city]/page.jsx`: generalized top-picks (any city with
  ≥3 qualifying venues) and budget section (any city with ≥2 published prices);
  lede now includes computed per-city stats; added nearby-city links.
- `lib/ideas.js`: `IDEA_CITIES` extended with oakville, markham, brampton,
  pickering.
- `birthday-party-ideas/[city]/page.jsx`: added nearby-city links alongside the
  existing other-cities list.
- Sitemap picks up the 4 new ideas pages automatically.
