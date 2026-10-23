# Brief: fix venue summaries/overviews after verification (branch refresh-2026-10)

Verifier report: VERIFY_refresh.md (grade D: 29 unsupported/wrong claims out of ~229 checked in a 26-venue sample; 16 of 26 venues had a flag). The sample error rate means ALL 91 rows need the same audit, not only the sampled ones.

For EVERY row in data/venues.csv:
1. Split `summary` and `overview` into individual claims. Keep a claim only if you can point to the exact supporting text in a saved file under data/raw_refresh/ (crawl output or maps data) or in that row's own existing CSV columns that came from the earlier pipeline (rating, reviews, kid_review_pct, review_red_flags, party_details, from_price). Delete or rewrite any claim without support. Do not add new facts unless you have the source text.
2. Review-based statements: only allowed when derived from the row's kid_review_pct / review_red_flags / rating / reviews columns, phrased plainly (e.g. "Rated 4.6 from 1,200 Google reviews; many reviews mention kids' parties."). No percentages unless the column has them; no claims about what reviewers praise unless review text is saved.
3. Fix the WRONG items listed in VERIFY_refresh.md first (Extreme Fun food only in the Friday package; Markham Sports Dome age cap 12 per source; Freckles World durations/prices: 30 min from $199, 1 hour $299 — re-check from_price is the true lowest full party package, not a 30-min mini option; if the lowest is a 30-min option, say so).
4. Overview 60-120 words; if after removing unsupported claims fewer than ~40 words of real facts remain, keep only the summary and leave overview EMPTY (user rule: drop content rather than guess). Summary must also be fully supported; if not, leave it empty.
5. Write AUDIT_overviews.csv: venue, claims_kept, claims_removed, overview_status (kept/trimmed/emptied), supporting file paths.
6. Rebuild: build_data.py data/venues.csv, node scripts/gen-llms.mjs, `cd web && npm run build` passes. Commit. Update REFRESH_REPORT.md with a short "Audit after verification" section (counts).
Rules: no paid API calls needed (use saved raw files; crawl4ai at http://localhost:11235 is allowed if a source page is missing — save the output). Never print keys/tokens. No parallel subagent swarms. No push, no deploy. Progress notes in PROGRESS_refresh.md. Print DONE when finished.
