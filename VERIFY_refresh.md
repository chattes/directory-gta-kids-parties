# Verification — refresh-2026-10 (independent verifier)

Scope: `data/venues.csv` (91 rows), `REFRESH_REPORT.md`, raw evidence in `data/raw_refresh/` (gitignored), `data/costs_refresh.csv`, `web/` build. No data or code was edited. Checks were run against the saved raw files only.

## Grade: D

About 13% of checked claims are unsupported or wrong (29 of roughly 229), 16 of 26 venues carry at least one flag, and the review-based claims cannot be traced to any saved file. The worker filled all 91 rows, which matches the suspicion in the brief: the sampled overviews add inference that the saved pages do not state.

## Item results

| # | Item | Result | Notes |
|---|------|--------|-------|
| 1 | Summary/overview fact check (20 seeded random + 8 named; 26 unique venues) | **FAIL** | 4 WRONG, 24 UNSUPPORTED (see below). 16 of 26 venues flagged. |
| 2 | Prices: changed and added rows | **PASS with notes** | All 16 changed/added/cleared prices have a source line in the crawls. Notes below. |
| 3 | Space Centre Vaughan removed as duplicate | **PASS** | Same address (688 Chrislea Rd), same party page, same domain (www vs non-www). Phone differs (+14372868461 vs +14372868801). |
| 4 | Ratings and review counts (10 spot-checks, plus all 91) | **PASS** | All 91 rows match `places_full.json` by place_id on rating and review count. |
| 5 | Costs under USD 3.00; no secrets in committed files | **PASS** | Total $0.4954 (3 log lines). Costs are the worker's own estimates, not Apify billing. No API keys or tokens in tracked files; the only matches are env-var references in scripts. `data/raw_refresh/` is gitignored and untracked. |
| 6 | `cd web && npm run build` | **PASS** | Exit 0. Venue pages and city pages generated. |

## Item 1: venue detail

Claims checked per venue (V = verified, U = unsupported, W = wrong).

- **Extreme Fun** (10 checked, 1 W): ages 1–10, 5,500 sq ft, prices $345/$390/$445, 50-guest cap, $200 deposit, $15 shared option, all verified. **W**: "a party-size pizza or 24 hot dogs" is listed as included in every private party. Only the Friday Nite package includes it.
- **Sandbox VR** (8 checked, 3 U): Epic Duo $550, 6 players, 2×40 min, $1,800 buyout, 10+ group bookings verified. **U**: "best for teens and up" and "built for teens and adults" (no age policy in source); "a private event space for cake" (no cake mention); "small share of reviews mention kids" (no review file saved).
- **Trapped Scarborough** (6 checked, 2 U): escape room + RC lounge, bookable sessions, membership and themes verified. **U**: "better suited to teens and adults" (no age policy in source); review-share claim.
- **Chuck E. Cheese Whitby** (9 checked, 2 U): $99.99 for 6 kids, 2 hours unlimited play, birthday show, Ticket Blaster, upgraded prize verified. **U**: "ages 4-10" (not in source); "weekends book up well in advance" (not in source).
- **GlowZone 360** (9 checked, 0 flags): $16.99 combo, $5 arcade, 18 holes, 40+ laser modes, 2015 opening, Canadian-owned, both cities verified.
- **Rec Room Roundhouse** (7 checked, 2 U): Kids & Teens packages, groups up to 40, catering, game bands and credits verified. **U**: "Google reviews trend towards group events and nights out" (no reviews file saved); "licensed venue" is an inference from "bar" in source (borderline, not counted).
- **Doodoo Kids** (7 checked, 1 U): grip socks, strollers, live capacity, Valleywood Dr verified. **U**: "around 65% of recent Google reviews" (no reviews file saved).
- **Rec Room Square One** (6 checked, 2 U): Timed Play Birthday, ~1 hour arcade, groups up to 40 verified. **U**: "built mainly for adults and teens" (inference); review-share claim.
- **Pixel Pulse** (9 checked, 0 flags): Pixel Punch $399 for 8, Pulse Max $1,199 for 25, $25 extra, $200 deposit, 7+ with no upper age limit, pizza and juice, bring-own-food with approval all verified.
- **Markham Sports Dome** (5 checked, 1 W, 1 U): Lil' Strikers 18 months to 12 years is in source; the 14-year cap belongs to Lil' Champions League. **W**: overview attributes "18 months to 14 years" to Lil' Strikers. **U**: "around 10% of recent Google reviews" (no reviews file saved).
- **Air Riderz Mississauga** (12 checked, 1 U): Silver $320 for 8, Gold $360 for 10, Platinum $540 with 2.5 hours, 2 pizza slices per child, socks, host, Valo Jump, Ninja course, dodgeball, weekend and glow prices verified. **U**: "free return jump pass for the birthday child" (not found in the crawled party page).
- **Liliput Playhouse** (10 checked, 0 flags): Chandelier $599, Balloon $699, Cloud $999, combined 30–35 kids ($1,599/$1,799), 95-guest buyout from $2,199, no outside food except cake, supervision rule all verified.
- **Fun Factory Pickering** (9 checked, 0 flags): Fun $399, Ultimate $999 weekday/$1,499 weekend for 50 kids, $14.99 extra child, $50 weekday saving, Tue/Thu drop-in discounts verified.
- **Kidsports Mississauga** (10 checked, 0 flags): 18,000 sq ft, 5,000+ parties, 20+ arcade games, Super Fun $399 (8), Mega Fun $799 (25), Soccer $599, $8 adult / $25 child extras, Dixie Rd verified.
- **Playcious Vaughan** (8 checked, 1 U): socks-only, 4-level jungle gym, safari ball pool, 2/3/4-hour formats, no published prices verified. **U**: "roughly ages 3 to 12" for the whole venue; the source applies "aged 3 to 12" only to the mini-car arena.
- **Another World VR Oakville** (9 checked, 1 U): 1,500 sq ft, three tiers, over-6 rule, bring-own-cake, no outside guests, no prices on site verified. **U**: "around 30% of recent Google reviews" (no reviews file saved).
- **BenTastic Magic** (8 checked, 1 U): Disney Cruise background, 13 years, 3 packages, 1–2 hour workshops, phone booking verified. **U**: "almost all from kids' parties" overstates the CSV's 85%.
- **Levelup VR** (8 checked, 0 flags): 20 stations, 80+ games, haptic add-on, event room for small birthday parties, 1-hour session, downtown Toronto verified.
- **Jump for Joy** (12 checked, 2 U): $589 for 35 people, $695 Majestic for 40, $14/child and $5/adult extras, $200 deposit with 3-month rebook, two hosts, free return pass, after-school and camps verified. **U**: "20-plus theme list" (count not in source); "around 90% of recent Google reviews" (no reviews file saved).
- **Never-Never Land** (7 checked, 3 U): phone, address, party types, no published prices verified. **U**: "camp programming" (not in crawl); "two themed private party rooms" (source says "magical", no theme named); "around 65% of recent Google reviews" (no reviews file saved).
- **Tiny Town Vaughan** (12 checked, 0 flags): ages 0–10, 8 playhouses, socks-only, water-only outside food, $389 for 20 (room rental), $470–$730 Town Party for 20–40, $1,500 full venue for 80, $13 extra guest, Google temporarily closed all verified. Overview is 129 words (brief max 120).
- **LEGOLAND Discovery Centre** (11 checked, 0 flags): $800/25 guests, $1,600/50 guests, 75-minute room with host, crown, button, activity pack, $19 Epic, $50/$75 passholder discounts, ages 3–10 verified. Note: the same page's FAQ lists Premium at $750 and Ultimate at $875 all-inclusive. The report flags this; the overview does not.
- **Freckles World** (9 checked, 2 W, 2 U): Randolph College founder, quote-form booking, $199 +HST plus $30 travel verified. **W**: "1-hour visits from $199" is the 30-minute price (1 hour is $249, or $299 in the second block). **W**: "90 minutes at $299" is the 1-hour price (1 hr 30 min is $349). **U**: "2-hour VIP princess or mascot parties at $349" ("VIP" not in source; the $349 2-hour row has no service name). **U**: "around 80% of recent Google reviews" (no reviews file saved).
- **Playplex Game** (12 checked, 0 flags): 17 games, $29.99 pass, Classic $499.99 Mon–Thu and $599.99 Fri–Sun, Premium $599.99/$699.99 for 12, 75/90 min, goodie bags, $29.99 extra, age 6 minimum, adult for ages 6–8, full payment at booking all verified.
- **Party Warehouse Outlet** (7 checked, 1 U): Huntingwood Dr, 7 days, supply and decor service, Facebook contact, baby shower and wedding categories verified. **U**: "contact by email" (no email in the crawl).
- **Inflatable Bouncy Castles Whitby** (9 checked, 0 flags): $249.99 themed castles, $349.99 combos, Whitby, delivery and setup, on-time and clean reviews verified.

Summary-level checks: no empty summary or overview, all summaries are 30 words or fewer, and every row has `facts_source_urls` and `last_verified` = 2026-10-23.

## Systemic findings

1. **Review claims have no saved source.** Review-share percentages (`kid_review_pct`) and "Google reviews trend towards..." statements cannot be traced to any file in `data/raw_refresh/` (there is no reviews file). The brief requires review claims to come from saved sources, so these are UNSUPPORTED as written. The 11 review-based claims in the sample are counted in the total.
2. **Fill-in past the sources.** Teen-only targeting, camp programming, and theme counts appear in overviews where the saved pages say nothing. This is the pattern the user's "leave empty" rule was meant to stop. 16 of 26 sampled venues have at least one flag.
3. **Overview length.** Tiny Town (129 words) and Giggles Playland (131 words) exceed the 120-word limit.
4. **Evidence pointer.** REFRESH_REPORT says the price evidence is in `data/raw_refresh/price_evidence.txt`. That file covers only 30 venues. The 11 added prices are supported in the crawl files, not in that file.

## Item 2: prices

- Changed prices verified against source: Tiny Town $389 (20-guest room rental), Playplex $499.99 (Classic Mon–Thu), Jump for Joy $589 (starting package), Freckles $199 (30-minute visit).
- **Freckles $199 note**: the from-price is a 30-minute visit with a $30 travel fee not included. This is a travel-fee confusion. The summary's "+HST plus travel" is correct; the overview is not (see Item 1).
- Jolly Bubble North York cleared: confirmed no North York price on either crawled page. The report says the only source was a wrong-location page; the evidence file says "no $ sentences found" on both pages. The report's reason is inaccurate, but the clearing is right.
- All 11 added prices verified in crawl files: Jumbaloo $350 DIY (+HST), Aerosports Scarborough $399 Premium, Kart Town $328 Cancun (8 kids), Funday $549 starting, Space Center $365 (home page only, package not named), Krafty $225 Fun Squad (up to 12 kids), Another World Brampton $549 (2 hours flat), Funvilla $524.99 (10 kids), Giggles $599 Basic (+HST), Sky Zone $380 (10-jumper package), Flying Squirrel $300 Mon–Thu.
- Per-child confusion: none found. Krafty, Sky Zone and Kart Town are package prices, not per-child.
- Chuck E. Cheese from_price is stored as 100; the page says $99.99. Rounded up, not wrong, but it does not match the source number.
- Report count: it says "27 verified unchanged"; the pre-merge snapshot implies 25 (30 non-empty before, minus 4 changed and 1 cleared). The final total of 40 is correct.

## Item 5: costs and secrets

- `data/costs_refresh.csv`: 0.0152 + 0.4602 + 0.0200 = **$0.4954**, under the $3.00 cap.
- `git grep` for `apify_api|token=|apikey|Bearer` matches only env-var references in scripts and a template `Authorization` header in `web/app/api/contact/route.js`. No literal keys.
- `data/raw_refresh/places_full.json` contains a third-party `rwg_token` (peerspace booking link), not a user API key. The directory is gitignored (`git check-ignore` confirms) and not tracked.

## Hype and quotes

- No quoted reviewer or customer statements in the 91 summaries and overviews.
- Hype words: "Ultimate" and "Epic" appear mainly as package names. Sampled non-package uses: "best for teens and up" (Sandbox), "best suited" (Trapped, Chuck). Low severity.

## Re-check (after audit commits c2141a8, 60f8d33)

Checker: independent verifier, second pass. Raw evidence only (`data/raw_refresh/crawls/`, `places_full.json`, `apify_wcc.json`). No data or code was edited.

Sample: `random.seed(23)`, `random.sample(range(91), 25)` over `data/venues.csv` row order. Indices: 37, 10, 2, 75, 39, 54, 48, 67, 45, 16, 24, 34, 56, 1, 28, 58, 3, 13, 89, 63, 53, 88, 65, 55, 82. Plus all 26 venues from the first pass. Five overlap (LEGOLAND, Playplex, Freckles, BenTastic, Another World Oakville), so 46 unique venues were checked. Claims are counted as discrete facts in summary + overview (approximate count). Review-share claims are counted as separate claims.

### Grade: C (was D)

**UNSUPPORTED 16, WRONG 4, of 416 claims (4.8%).** Of the 16 UNSUPPORTED, 11 are review-share percentages (see Systemic note below).

### Per-venue results

Only non-SUPPORTED items are listed. All other claims were checked and found SUPPORTED.

Seed-23 sample:

| Venue | Claims | U | W | Notes |
|---|---|---|---|---|
| Krafty Kids (37) | 8 | 1 | 0 | U: "About 85% of reviews" (no reviews file; equals kid_review_pct). |
| LEGOLAND Discovery Centre (10) | 12 | 0 | 0 | Passholder $50/$75 off: party page line 271. |
| Aerosports Brampton (2) | 6 | 0 | 0 | |
| Artventures Toronto Parliament (75) | 5 | 1 | 0 | U: "About 5%" reviews. |
| Mighty Jungle (39) | 9 | 0 | 0 | Package #1 detail is in the party file. |
| Creative Playzone (54) | 10 | 0 | 0 | |
| Playplex Game (48) | 14 | 0 | 0 | 60-min room and 75/90-min gameplay in party file lines 7-26. |
| Giggles Playland (67) | 7 | 0 | 0 | |
| The Play Scape (45) | 11 | 1 | 0 | U: "About 70%" reviews. |
| Jungle Land (16) | 7 | 0 | 0 | |
| Funday! (24) | 12 | 0 | 0 | |
| Space Center Playground (34) | 8 | 0 | 0 | |
| Happy Planet Leaside (56) | 7 | 1 | 0 | U: "About 65%" reviews. "Closes early on some days" rests on one notice (July 24), counted supported. |
| Aerosports Parks Scarborough (1) | 9 | 0 | 0 | Ultimate 180 min / 60-min room: party file line 81-85. |
| Kid's Cuckoos Nest (28) | 12 | 0 | 1 | W: "Access 2 Card holders get free admission." Home line 92: free admission is for a support person, not the card holder. |
| Happy Kingdom Brampton (58) | 8 | 0 | 0 | |
| Aerosports Oakville (3) | 9 | 1 | 0 | U: "loot bags priced as add-ons." No loot-bag line in crawl (only "Outside Food & Drinks"). Ultimate $599/150/60 is correct (party file lines 78-96). |
| Playdium Orion Gate (13) | 8 | 1 | 0 | U: "each includes a birthday gift and game credits." Credits appear only in Ultimate and Powerplay Pizza (party file lines 49, 57). Bonus Round and Timed Play do not list them. |
| Aspire Climbing Whitby (89) | 9 | 0 | 0 | Auto-belay is a facility-level claim (home lines 115, 246), not party-page. |
| Freckles World (63) | 9 | 1 | 0 | U: "About 80%" reviews. The 2-hr VIP $349 claim is supported by one listing (vip-princess-party-1, 2 hr). A second VIP listing says 1 hr 30 min, so the source conflicts. Counted supported. See Freckles answer below. |
| BenTastic Magic (53) | 10 | 1 | 0 | U: "about 85%" reviews. |
| Crock A Doodle Whitby (88) | 8 | 0 | 0 | |
| Playdium Fairview (65) | 11 | 2 | 0 | U: same game-credits overgeneralization as Orion Gate. U: "About 10%" reviews. |
| Another World VR Arena Oakville (55) | 7 | 1 | 0 | U: "About 30%" reviews. |
| Bloom & Grow (82) | 10 | 0 | 0 | Nut-aware policy and $50 cleaning fee: party file lines 128-129. |

Earlier first-pass venues (21, excluding overlaps):

| Venue | Claims | U | W | Notes |
|---|---|---|---|---|
| Extreme Fun (41) | 11 | 0 | 0 | Prior WRONG (food on every party) is fixed. Overview now says only Friday Nite includes food. |
| Sandbox VR (19) | 8 | 0 | 0 | Prior U items (cake, teen targeting, review share) are gone from current text. |
| Trapped Scarborough (50) | 5 | 0 | 0 | |
| Chuck E. Cheese Whitby (83) | 7 | 1 | 1 | W: "upgraded prizes for the birthday child." Source says "Upgraded Prizes for The Whole Party" (party file lines 289, 305). U: "Higher-priced packages add pizza, drinks and dessert." Unlimited soft drinks are in the base $99.99 package (line 333). Dessert is only an optional add-on (line 444). Pizza is an optional add-on (line 310). |
| GlowZone 360 (6) | 9 | 0 | 0 | "Hassle-free" is the venue's own copy (see Item 4). |
| Rec Room Roundhouse (9) | 8 | 1 | 0 | U: "Roundhouse Park." Not in any crawl. Address on file is 255 Bremner Blvd. |
| Doodoo Kids (68) | 10 | 1 | 0 | U: "About 65%" reviews. |
| Rec Room Square One (12) | 6 | 0 | 0 | |
| Pixel Pulse (46) | 12 | 0 | 0 | Dedicated party host: party file line 97. |
| Markham Sports Dome (74) | 8 | 1 | 1 | W: "indoor sports complex at 6140 16th Ave." Home line 109 labels 6140 16th Ave as the "Temporary Location" (Mount Joy Community Centre). Row address is 5300 14th Ave. U: "About 10%" reviews. |
| Air Riderz Mississauga (7) | 10 | 0 | 0 | |
| Liliput Playhouse (64) | 12 | 0 | 0 | |
| Fun Factory Pickering (27) | 11 | 0 | 0 | Weekday $50 saving: home line 10. |
| Kidsports Mississauga (4) | 9 | 0 | 0 | Tablecloths: lines 80, 166. |
| Playcious Vaughan (11) | 10 | 0 | 0 | |
| Levelup VR (8) | 10 | 0 | 0 | |
| Jump for Joy (30) | 11 | 0 | 0 | Deposit moves if rebooked within 3 months: party file line 194. |
| Never-Never Land (70) | 6 | 1 | 0 | U: "About 65%" reviews. |
| Tiny Town Vaughan (44) | 12 | 0 | 0 | Town Party $470/$730 present (party file lines 115, 125). Google "temporarily closed" is true in places_full. Overview is 119 words, so the earlier 129-word overflow is fixed. |
| Party Warehouse Outlet (78) | 8 | 0 | 0 | |
| Inflatable Bouncy Castles Whitby (90) | 7 | 0 | 1 | W: "6-in-1 ... Unicorn." The product is the "5-1 Unicorn Combo" (home line 25). |

### Freckles World: $299 question

First verifier said "1 hour = $299" and "90 minutes at $299." Both are wrong. The source text (party page, Wix service blocks) reads:

- "30 min / $199+hst +$30Travel" (Mini Princess Visit)
- "1 hr / $249+hst+Travel" (Fancy Princess Visit)
- "1 hr / $299+hst plus travel" (Fancy Face painting & Twisted Balloons)
- "2 hr / $349+hst+Travel" (VIP Princess Party, vip-princess-party-1)
- "1 hr 30 min / $349+hst plus travel" (Royal Face painting & Balloons & Games; second VIP Princess Party listing)

**The audit is right:** 30 min $199, 1 hr $249 (other 1-hr option $299), 2-hr VIP $349. The first verifier's "VIP not in source" note is also wrong. "VIP Princess Party" is in the source.

### Jolly Bubble North York: party_page_url

**Confirmed wrong.** The row now reads `party_page_url = https://thejollybubble.com/barrhaven-party/`, with `party_page_status = party_page_found`. Barrhaven is the Ottawa/Nepean franchise (home page, "Barrhaven, Ottawa"). The North York party page that was actually crawled is `https://thejollybubble.com/north-york-party` (manifest entry; `facts_source_urls` also lists it). That page is generic copy with no prices. The correct value would be `https://thejollybubble.com/north-york-party`. Also, `party_details` "Packages from · up to 15 kids · 2 hours" has no North York source. The overview's "no North York package prices" statement is correct.

### Item 4: hype words and review claims

- **Hype:** Mostly package names: Ultimate, Epic, Premium, Fun, Magic. Low severity.
- **Real hype/fit wording:** "hassle-free" (GlowZone, venue copy); "stress-free" (Kidz at Play, attributed to venue ads); "best for ages 2 to 9" (Kart Town, fit inference, not a review claim).
- **Review claims:** 22 sentences with review percentages or ratings. Every "Rated X from N" matches the row's rating/reviews. Every percentage matches `kid_review_pct`. The underlying review file (JSON input to `scripts/score_reviews.py`) is not saved in `data/raw_refresh/`. Reviews arrays in `places_full.json` are empty. So review-share claims are backed only by the row column and are counted UNSUPPORTED against raw evidence.
- **Testimonials:** Inflatable's "reviews on the site" is backed by testimonial text in its home page crawl.

### Item 5: build

`cd web && npm run build` exits 0. Log in the scratchpad.

### Systemic

1. Review-share percentages (11 U in this check) have no saved source file. Either save the reviews JSON used by `score_reviews.py` or drop the sentences.
2. Four WRONG items are minor and were not flagged by the first pass: Kid's Cuckoos Access 2, Chuck E. Cheese prize scope, Markham address, Inflatable Unicorn. Fix them before the next publish.
3. Game-credits overgeneralization appears in Playdium Orion Gate and Playdium Fairview. Playdium Whitby (row 87) has the same wording in its overview but was not checked.
