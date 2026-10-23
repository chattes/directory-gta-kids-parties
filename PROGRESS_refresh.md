# Refresh progress — 2026-10-23 (branch refresh-2026-10)

Canonical data: `data/venues.csv` (103 rows, 14 cities at start).
Brief: `BRIEF_refresh.md`. Apify hard cap USD 3.00.

## Step 1 — Listing verification
- [x] Read PLAYBOOK.md + vault notes (Directory Business Playbook, Whitby Crawl Findings)
- [x] Env check: APIFY_API_KEY present, crawl4ai server up (:11235 health 200)
- [ ] `scripts/verify_listings.py` run
- [ ] Apify Maps re-scrape of existing place_ids (rating/reviews/open-closed)
- [x] Apify places test run: 3 items, $0.0152 (~$0.005/item) → logged
- [x] Apify full re-scrape: 92/92 place_ids, run tjP2HKzYn0XC7ViJ9, $0.4602
  - raw: data/raw_refresh/places_full.json
  - 0 permanently closed; 2 temporarilyClosed (Tiny Town Vaughan; Centreville
    Amusement Park — seasonal island park, Oct closure expected)
  - no rating moved >=0.2; review counts grew normally → step 3 review re-score
    likely unnecessary
- [x] verify_listings.py: 92/92 websites ok, 0 dead, 0 suspect
  (data/verify_report.json, 183s)

## Step 2 — Website + party page crawl (crawl4ai)
- [ ] crawl_refresh.py running (homepages + party pages -> data/raw_refresh/crawls/)
- [ ] from_price re-verification (30 venues) with source sentences
- [x] crawl_refresh.py: 164/169 URLs ok on first pass; 5 failures handled:
  Funday home + Jolly Bubble whitby/north-york party pages via Apify
  website-content-crawler ($0.02, Cloudflare/Wix blocks); Playtopia Pickering
  party page is a PDF -> pdftotext; Giggles home covered by its own page crawl.
- [x] from_price re-verification (30 venues, source sentences in
  data/raw_refresh/price_evidence.txt + raw crawl greps):
  - 27 verified unchanged
  - Tiny Town Vaughan: $470 -> $389 (weekday Caledon/Innis Lake room rental now
    the cheapest published party package; also temporarilyClosed on Google)
  - Jolly Bubble North York $480 -> CLEAR (only source was wrong-location
    barrhaven-party page; no North York price published)
  - Playplex Game $600 -> CLEAR (no package price published on party page)
  - LEGOLAND $800 kept (packages table "Standard $800 for 25 guests"; FAQ shows
    $750 all-inclusive - discrepancy noted for report)

## Step 3 — Review re-scoring
- [x] SKIPPED: no rating moved >=0.2 stars; review counts grew normally.

## Step 4 — Summary/overview columns
- [x] content.jsonl written for all 91 venues (indices 0-91 minus removed duplicate 73)
- [x] merge_refresh.py: ratings/reviews updated from places_full.json (89 rows),
  summary/overview/facts_source_urls/last_verified (2026-10-23) added to all rows,
  from_price changes+additions applied (16 rows), Playtopia Vaughan party_page_url
  fixed, Space Centre Vaughan duplicate removed (92 -> 91 rows)

## Step 5 — Curation
- [x] kid_fit.py rerun (dist: 1x7, 2x11, 3x14, 4x22, 5x37)
- [x] price_bucket recomputed for 13 affected rows
- [x] PLAYBOOK manual rules checked: no host-building conflation; adult-skew rows
  (Playdiums, Rec Room, Sandbox VR, Trapped, ZAK Sports, Artventures) kept + flagged

## Step 6 — Rebuild
- [x] build_data.py -> web/lib/data/venues.json (91 venues, 14 cities)
- [x] gen-llms.mjs -> web/public/llms-full.txt
- [x] counts bumped 92 -> 91 (llms.txt, ai.txt, ai/*.json, layout.jsx, make_wish_pins.py)
- [x] npm run build passes (14 city pages, 91 venue pages)

## Step 7 — Report
- [x] REFRESH_REPORT.md written (per-venue table, totals, costs, flags)
- [x] costs: $0.4954 total of $3.00 cap (data/costs_refresh.csv)

## Audit after verification (brief: BRIEF_refresh_fix.md)
- [x] All 91 rows reviewed claim by claim against data/raw_refresh (batches 0-90)
- [x] data/venues.csv summary/overview rewritten; commit c2141a8
- [x] AUDIT_overviews.csv written (91 rows)
- [x] build_data.py, gen-llms.mjs, npm run build (exit 0)
- [x] REFRESH_REPORT.md "Audit after verification" section
- DONE
