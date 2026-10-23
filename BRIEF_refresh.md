# Brief: refresh + validate venue data for torontobirthdayparties.com (branch refresh-2026-10, this worktree)

Repo: this worktree (`~/Development/gta-refresh`, Next.js site in `web/`, data pipeline in `scripts/`, canonical data `data/venues.csv`, 103 rows / 14 cities). Read `PLAYBOOK.md` fully first: it is the pipeline and the curation rules. Also read the vault notes for history and traps (read only, do not edit):
- `~/Documents/AI Brain/Personal/Side Hustle/Directory Business Playbook.md` (incl. "Monthly Listing Verification")
- `~/Documents/AI Brain/Personal/Side Hustle/Whitby Expansion - Crawl Findings.md` (extraction traps)

## Goal
Make sure every listing is current and true, and add a short summary + overview per venue for a new "best venues by city" section (another agent is doing keyword research for that section; you only produce the data).

## Steps
1. **Listing verification:** run `python3 scripts/verify_listings.py` and refresh Google Maps data for existing venues (rating, review count, open/closed status) with Apify `compass/crawler-google-places` (the existing scripts; `APIFY_API_KEY` env var). Prefer re-scraping only the existing place_ids / names over a full city sweep. Flag permanently-closed, dead websites, moved addresses.
2. **Website + party page check with crawl4ai** (first choice; server `http://localhost:11235`, client `~/crawl4ai/venv/bin/python ~/crawl4ai/crawl.py <url>`, Python API `sys.path.insert(0, "/home/chattes/crawl4ai"); from crawl import crawl`; token is read by the client from `~/crawl4ai/crawl4ai.env` — never print it). For each venue: homepage + party page still up? Does it still offer kids' birthday parties? Re-check published `from_price` against the page (source sentence required; deposits/add-ons excluded). Use Apify only when crawl4ai is blocked (Cloudflare etc.).
3. **New review signal (optional, cheap):** only if needed to re-score venues whose rating changed a lot: `apify_reviews_run.py` + `score_reviews.py`.
4. **Summary + overview per venue** (new CSV columns `summary`, `overview`, `facts_source_urls`, `last_verified`):
   - `summary`: 1 sentence, <= 30 words: what it is and what the party is (e.g. "Indoor trampoline park in Whitby; 2.5-hour parties with jump time and a private party room.").
   - `overview`: 60-120 words, plain and specific: party format, ages, duration, capacity, what's included, from-price if verified, standout points from the venue's own pages and the pattern in Google reviews (no quotes of individuals, no invented facts).
   - Every fact must come from a saved crawl/scrape file (save raw to `data/raw_refresh/` — gitignored if large). If you cannot find enough real info for a venue, leave summary/overview EMPTY and list the venue in the report as "insufficient info"; the user decided: drop the content rather than guess. No ad data, no ad copy.
   - Human voice; no hype, no "nestled", "vibrant", "look no further", "perfect for".
5. **Curation:** apply PLAYBOOK rules. `dead`/closed = remove the row. Anything else questionable: keep it but list it in the report for the user to decide.
6. Run `build_data.py data/venues.csv`, `node scripts/gen-llms.mjs`, bump hand-written counts if totals changed (see PLAYBOOK), `cd web && npm run build` must pass. Do NOT deploy, do NOT push.
7. Write `REFRESH_REPORT.md`: per venue: status (ok / updated / removed / flagged), what changed (old -> new rating/reviews/price), summary present Y/N, sources. Totals. Costs: log every paid call (Apify) to `data/costs_refresh.csv`.

## Budget and rules
- Apify hard cap USD 3.00 for this job. Make one small test run first and record its cost. Stop before the cap.
- Never print or write API keys/tokens. Keys stay in env vars.
- Every number must come from a saved raw file; say "not available" instead of guessing.
- No Google Maps photos. No Yelp/TripAdvisor scraping.
- Do NOT use parallel subagent swarms (they burn the usage quota). Work sequentially; commit after each step; keep progress notes in `PROGRESS_refresh.md` so a replacement worker can resume.
- Print DONE when finished.
