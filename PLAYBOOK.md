# GTA Kids Parties — Venue Curation & Update Playbook

Everything needed to refresh, expand, or prune the venue directory.
Scripts live in `scripts/`, run them from the repo root. No other deps beyond
`APIFY_API_KEY` (and `DATAFORSEO_B64` if you also want keyword checks).

**The canonical curated list is `data/venues.csv`** — the single source of
truth the site is built from. Never edit copies elsewhere.

## The pipeline (full refresh, ~30 min, ~$2)

```
1. apify_run.py            → scrape Google Maps (prints run + dataset id)
2. download dataset        → curl (see script output) → raw.json
3. clean_places.py         → raw.json → places.csv     (dedupe, closed, non-GTA, category filter)
4. verify_sites.py         → party evidence from each venue's homepage
5. party_pages.py          → deep-crawl party pages → prices/capacity/duration
6. apify_reviews_run.py    → pull ~20 recent Google reviews per venue (~$0.01/venue)
7. score_reviews.py        → kid-fit scoring, flags bad ones (always eyeball the flags)
8. MANUAL pass             → delete rows you disagree with; fix edge cases (see rules below)
9. build_data.py data/venues.csv → web/lib/data/venues.json
10. cd web && npm run build && npx vercel --prod
```

## Routine updates

**Monthly listing verification:** `python3 scripts/verify_listings.py` (read-only;
writes `data/verify_report.json`, gitignored). Drop rules + post-drop steps: see
"Monthly Listing Verification (cron)" in the Directory Business Playbook (vault).
`dead` is the only auto-drop case.

**Delist a venue:** delete its row from the CSV → `build_data.py` → rebuild → deploy.
That's it. Google drops the page from the index on its next crawl (it's 404'd
via not-found).

**Add one venue by hand:** add a row with at least name, categories, address,
city, website, google_maps_url — the site renders fine with partial data.

**Add a city or category:** edit `CITIES` / `CATEGORIES` at the top of
`scripts/apify_run.py`, then run the full pipeline. (Whitby was added this
way on 2026-09-18 — `CITIES` is now 13; scrape a subset only with e.g.
`PLACES_CITIES='["Whitby"]' python3 scripts/apify_run.py`.)

**Full refresh cadence:** quarterly is plenty. Monthly if you're actively growing.

## Manual curation rules (hard-won, do not skip step 8)

These are the failure modes the automation *cannot* catch. Check for them:

1. **Host-building conflation** — Maps sometimes lists the tenant under the
   building's name (e.g. "Nations Experience" was a supermarket; the real venue
   inside it was "Happy Kingdom Playground"). If categories look like a
   supermarket/mall/plaza with one "Playground" tag, rename the row to the
   actual tenant business.
2. **Adult venues in kid clothing** — arcade *bars*, rage rooms, axe throwing:
   high rating, low kid_review_pct. We dropped FreePlay (bar) and BRKFREE
   (rage room) this way. Rule of thumb: if a parent wouldn't book a 6-year-old's
   party there, delist.
3. **Chains** — keep one row per *location* (Aerosports Brampton ≠ Aerosports
   Scarborough). Each location gets its own city page ranking.
4. **Entertainers vs venues** — magicians/face painters are fine to keep, but
   they have no address; the site handles it. If you want a strict
   brick-and-mortar directory, filter `categories` for Entertainer/Magician.
5. **Dead websites** — party_signal "unknown" + domain doesn't resolve →
   probably closed. Call the phone number or delist.

## Tuning knobs (top of each script)

| Script | Knob | Default |
|---|---|---|
| apify_run.py | `CITIES`, `CATEGORIES`, `MAX_PER_SEARCH` | 12 cities, 4 cats, 60 |
| score_reviews.py | `MIN_RATING`, `MIN_REVIEWS`, `MAX_NEG_PCT`, `MIN_RECENT_AVG` | 4.0, 15, 25%, 3.8 |
| apify_reviews_run.py | max reviews per venue (arg 2) | 20 |

Loosen `MIN_REVIEWS` when expanding into sparse suburbs (you'll get more
"flagged" rows — that's expected, review them by hand).

## Costs

- Places scrape: ~$1–3 depending on result count
- Reviews: ~$0.01 per venue (20 reviews)
- Keyword checks (optional, DataForSEO): ~$0.05–0.10 per batch of 100
- Vercel hosting: $0

## What we deliberately do NOT do

- No Google Maps photos (license violation). Images come later via venue
  "claim your listing" submissions.
- No Yelp/TripAdvisor scraping — these venue types barely exist there; Google
  reviews are the reputation source that matters.
- No blog/guides for now — city + venue pages are the keyword play.
