# Refresh Report — 2026-10-23

Branch `refresh-2026-10`. Brief: `BRIEF_refresh.md`. Canonical data: `data/venues.csv`.
Raw evidence: `data/raw_refresh/` (gitignored) — Apify pulls (`places_full.json`), crawl4ai
markdown per page (`crawls/` + `manifest.json`), price source sentences (`price_evidence.txt`),
written content (`content.jsonl`), pre-merge CSV snapshot (`venues_pre_merge.csv`).

Note: the brief says 103 starting rows; the CSV actually held **92** data rows at start.
The refresh ends with **91 rows** (one duplicate removed).

## Totals

- Venues at start: 92 → at end: **91** (14 cities, unchanged)
- Websites checked: 92/92 up, 0 dead (`data/verify_report.json`)
- Google Maps re-scrape: 92/92 place_ids, 0 permanently closed
- Temporarily closed: 2 (see flags)
- Ratings moved >= 0.2 stars: 0 → review re-scoring (step 3) skipped
- Pages crawled for step 2: 169 URLs (homepages + party pages), all covered after fallbacks
- New columns written for all 91 rows: `summary`, `overview`, `facts_source_urls`, `last_verified` (= 2026-10-23)
- `from_price`: 27 verified unchanged, 4 changed, 1 cleared, 11 added
- Build: `npm run build` passes (14 city pages, 91 venue pages)

## Removed

- **Space Centre Vaughan** (place_id ChIJg5OzwzsvK4gRWJfA_Wt5ePo, 4.4/265 reviews) —
  duplicate Google listing of **Space Center Playground** (ChIJsYrUcb8vK4gRS786IrfrhAo,
  4.8/680), same address (688 Chrislea Rd, Vaughan) and same party page. Kept the
  stronger listing; removed the weaker row.

## Price changes (old -> new, evidence in data/raw_refresh/price_evidence.txt)

- Tiny Town Vaughan: $470 -> **$389** (cheapest published weekday room rental; venue also temporarilyClosed)
- Playplex Game: $600 -> **$500** (Classic package $499.99 Mon-Thu published on party page)
- Freckles World: $299 -> **$199** (current site lists packages from $199)
- Jump for Joy Play Centre: $695 -> **$589** (current published package price)
- Jolly Bubble North York: $480 -> **cleared** (only source was a wrong-location page; no North York price published)

## New from_price added (previously blank)

Jumbaloo Playgrounds $350 · Aerosports Scarborough $399 · Kart Town $328 · Funday! $549 ·
Space Center Playground $365 · Krafty Kids $225 · Another World VR Brampton $549 ·
Funvilla Oakville $525 · Giggles Playland $599 · Sky Zone Whitby $380 · Flying Squirrel Whitby $300

Price buckets recomputed for all affected rows; `kid_fit` recomputed (`scripts/kid_fit.py`).

## Other data fixes

- Playtopia (Vaughan): `party_page_url` was a CSS file link -> `http://playtopia.ca/parties`
- Ratings/review counts refreshed from Apify for 89 of 91 rows (normal drift, no big moves)
- Hand-written venue counts bumped 92 -> 91 in `web/public/llms.txt`, `.well-known/ai.txt`,
  `ai/summary.json`, `ai/faq.json`, `ai/service.json`, `web/app/layout.jsx`, `scripts/make_wish_pins.py`;
  ai.txt/summary.json `updated` dates bumped to 2026-10-23

## Flags for the user (kept in directory, your call)

- **Tiny Town Vaughan** — marked *temporarily closed* on Google at scrape time, on top of the
  price cut. Worth a phone call; if closed for good, delist.
- **Centreville Amusement Park** — temporarily closed, but it is a seasonal island park in
  October; expected. Re-check in spring.
- **LEGOLAND Discovery Centre** — packages table says $800 for 25 guests, FAQ on the same
  site says $750 all-inclusive. Kept $800 (the packages table); discrepancy unresolved.
- **ZAK Sports Cricket** — kid_review_pct 0; has an "Events & Parties" page (cricket, Nerf,
  bubble ball) but reviews never mention kids. Adult-skew.
- **Playdium (all 3) / The Rec Room Square One / Sandbox VR / Trapped Scarborough** —
  kid_fit 1, adult-skew venues, but all publish real kids' party packages. Kept per
  previous curation; delist if you want a stricter under-10 directory.
- **Party Warehouse Outlet & Classic Event Decor** — a party supply store + decor service,
  not a venue. Kept as a planning resource; delist if you want venues only.
- **Inflatable Bouncy Castles Whitby** — rental delivery service, not a venue (same category
  of judgement call).
- **Markham Sports Dome** — party evidence is weak (no dedicated party page found); has
  kids' soccer programs and event hosting.
- **Artventures Toronto Parliament** — kid_fit 1 by review mentions, but it explicitly
  offers kids birthday pottery parties. Kept.

## Costs (data/costs_refresh.csv)

| Date | Service | Detail | Items | Cost (USD) |
|---|---|---|---|---|
| 2026-10-23 | Apify | places test run (3 place_ids) | 3 | $0.0152 |
| 2026-10-23 | Apify | full Maps re-scrape (92 place_ids) | 92 | $0.4602 |
| 2026-10-23 | Apify | website-content-crawler fallback (3 blocked pages) | 3 | $0.0200 |
| | | **Total** | | **$0.4954** |

Budget cap was $3.00; spent ~$0.50. crawl4ai (local Docker) and pdftotext: $0.

## Per-venue status

| Venue | City | Status | What changed | Summary | Sources |
|---|---|---|---|---|---|
| Jumbaloo Playgrounds | Mississauga | updated | rating 4.8 (5523) -> 4.8 (5550); price - -> 350 | Y | https://jumbaloo.com/argentia/indoor-birthday-parties/, https://jumbaloo.com/ |
| Aerosports Parks - Scarborough/Toronto | Scarborough | updated | rating 4.8 (2048) -> 4.8 (2207); price - -> 399 | Y | https://www.aerosportsparks.ca/scarborough/kids-birthday-parties, https://www.aerosportsparks.ca/scarborough |
| Aerosports Brampton | Brampton | updated | rating 4.3 (2848) -> 4.3 (2867) | Y | https://aerosportsbrampton.ca/kids-birthday-parties/, https://www.aerosportsparks.ca/ |
| Aerosports Trampoline Parks - Oakville-Mississauga | Oakville | updated | rating 4.7 (5596) -> 4.7 (5780) | Y | https://www.aerosportsparks.ca/oakville/kids-birthday-parties, https://www.aerosportsparks.ca/oakville |
| Kidsports Indoor Playground Mississauga | Mississauga | updated | rating 4.3 (2192) -> 4.3 (2233) | Y | https://www.kidsportsindoorplayground.com/book, https://www.kidsportsindoorplayground.com/ |
| Centreville Amusement Park | Toronto | updated | rating 4.4 (6612) -> 4.4 (6635) | Y | https://centreisland.ca/birthday-parties/, http://centreisland.ca/ |
| GlowZone 360 | Brampton | updated | rating 4.5 (1817) -> 4.5 (1856) | Y | https://glowzone360.com/, http://www.glowzone360.com/ |
| Air Riderz Mississauga - Kids Indoor Playground & Birthday Party Place | Mississauga | updated | rating 4.4 (3542) -> 4.5 (3610) | Y | https://www.airriderz.com/mississauga/parties-events/, https://www.airriderz.com/mississauga/ |
| Levelup Virtual Reality (VR) Arcade | Events, Parties, & Team Building | Toronto | updated | rating 4.9 (1874) -> 4.9 (1888) | Y | https://www.levelupreality.ca/toronto/ |
| The Rec Room Roundhouse | Toronto | updated | rating 4 (9289) -> 4 (9324) | Y | https://www.therecroom.com/toronto-roundhouse/parties-groups, https://www.therecroom.com/toronto-roundhouse |
| LEGOLAND Discovery Centre Toronto | Vaughan | updated | rating 4 (7157) -> 4 (7247) | Y | https://www.legolanddiscoverycentre.com/toronto/groups-schools/birthdays/, https://www.legolanddiscoverycentre.com/toronto/ |
| Playcious Vaughan | Concord | updated | rating 4.4 (1874) -> 4.4 (1892) | Y | https://playcious.com/vaughan/ |
| The Rec Room Square One | Mississauga | updated | rating 4 (6408) -> 4 (6449) | Y | https://www.therecroom.com/mississauga-squareone/parties-groups, https://www.therecroom.com/mississauga-squareone |
| Playdium Orion Gate | Brampton | updated | rating 4 (2256) -> 4 (2278) | Y | https://www.playdium.com/brampton/party, https://www.playdium.com/brampton |
| The Bubble Jump Park - Toronto | North York | updated | rating 4.6 (1655) -> 4.6 (1686) | Y | https://the-bubble.ca/, https://www.the-bubble.ca/ |
| Air Riderz Adventure Park Vaughan | Concord | updated | rating 4.5 (1605) -> 4.5 (1678) | Y | https://www.airriderz.com/vaughan/birthday/, https://www.airriderz.com/vaughan/ |
| Jungle Land | Concord | updated | rating 4.4 (1514) -> 4.4 (1521) | Y | https://www.jungleland.ca/birthday-party-packages.html, http://www.jungleland.ca/ |
| The Bubble Jump Park - Vaughan | Woodbridge | updated | rating 4.8 (1420) -> 4.8 (1500) | Y | https://the-bubble.ca/, https://www.the-bubble.ca/ |
| Playcious Mississauga | Mississauga | updated | rating 4.7 (1093) -> 4.7 (1148) | Y | https://playcious.com/mississauga/ |
| Sandbox VR | Vaughan | updated | rating 5 (1126) -> 5 (1400) | Y | https://sandboxvr.com/ca/toronto/vaughan/private-events, https://sandboxvr.com/ca/toronto/vaughan |
| Kidsapia | Mississauga | updated | rating 4.4 (1229) -> 4.4 (1261) | Y | https://www.kidsapia.ca/ |
| Playcious Oakville | Oakville | updated | rating 4.5 (1118) -> 4.5 (1126) | Y | https://playcious.com/oakville/, https://www.playcious.com/oakville |
| Playtopia | Vaughan | updated | rating 4.2 (1373) -> 4.2 (1388); party_page_url fixed | Y | http://playtopia.ca/parties, http://playtopia.ca/ |
| Kart Town Playground and Birthdays | Scarborough | updated | rating 4.8 (861) -> 4.8 (867); price - -> 328 | Y | https://karttown.ca/ |
| Funday! Family Centre & Indoor Playground | Mississauga | updated | rating 4.8 (889) -> 4.8 (918); price - -> 549 | Y | https://www.thefunday.ca/ |
| TreeHouse ClubHouse | Pickering | updated | rating 4.2 (1172) -> 4.2 (1181) | Y | http://www.treehouseclubhouse.com/ |
| FUNtastic Forest | Concord | updated | rating 4.5 (676) -> 4.5 (684) | Y | https://www.funtasticforest.ca, http://www.funtasticforest.ca/ |
| Fun Factory Play Cafe - Pickering | Pickering | updated | rating 4.4 (803) -> 4.4 (821) | Y | https://www.funfactoryplay.ca/birthday-parties, http://www.funfactoryplay.ca/ |
| Kid's Cuckoos Nest | Aurora | updated | rating 4.3 (839) -> 4.3 (841) | Y | https://kidscuckoosnest.com/party-booking/, http://kidscuckoosnest.com/ |
| Kids Fun Town | Toronto | updated | rating 4.7 (514) -> 4.7 (521) | Y | https://kidsfuntown.ca/party-packages, https://kidsfuntown.ca/ |
| Jump for Joy Play Centre | Toronto | updated | rating 4.9 (397) -> 4.9 (401); price 695 -> 589 | Y | https://jumpforjoyplaycentre.ca/parties-1, https://jumpforjoyplaycentre.ca/ |
| Little Jingle Beans Inc. | Toronto | updated | rating 4.9 (359) -> 4.9 (364) | Y | https://www.littlejinglebeans.com/pages/mascot-parties, http://www.littlejinglebeans.com/ |
| Funland Indoor Playground | Markham | updated | rating 4.5 (691) -> 4.5 (702) | Y | https://funlandplayground.ca/ |
| Happy Kingdom Dundas | Mississauga | updated | rating 4.7 (769) -> 4.7 (792) | Y | https://happykingdomdundas.ca/party/, https://happykingdomdundas.ca/ |
| Space Center Playground | Vaughan | updated | rating 4.8 (665) -> 4.8 (680); price - -> 365 | Y | https://space-center.ca/, https://space-center.ca/private-party/ |
| Artventures Oakville Lakeshore/Bronte | Oakville | updated | rating 4.9 (784) -> 4.9 (798) | Y | https://artventuresstudios.com/groups%2Fparties, http://artventuresstudios.com/ |
| Jolly Bubble North York | North York | updated | rating 4.7 (501) -> 4.7 (516); price 480 -> cleared | Y | https://thejollybubble.com/north-york-party |
| Krafty Kids | Corporate Holiday Parties & Creative Kids’ Events | Toronto | updated | rating 5 (241) -> 5 (244); price - -> 225 | Y | https://kraftykidswithsarah.com/portable-parties, http://www.kraftykidswithsarah.com/ |
| Magic Moments Playground & Birthday Parties | Toronto | updated | rating 4.9 (348) -> 4.9 (361) | Y | https://magicmomentsplay.ca/birthday-parties/, http://www.magicmomentsplay.ca/ |
| Mighty Jungle Indoor Playground | Mississauga | updated | rating 4.5 (445) -> 4.5 (444) | Y | http://www.themightyjungle.ca/Home/Parties, http://www.themightyjungle.ca/ |
| Playtopia Pickering | Pickering | updated | rating 4.7 (398) -> 4.7 (404) | Y | https://pickering.playtopia.ca/, https://media2.onelinkpos.com/manual-uploads/Playtopia-Pickering-Party-E-Invitation.pdf |
| Extreme Fun Indoor Playground | North York | updated | rating 4.7 (293) -> 4.7 (297) | Y | http://www.extremefun.ca/#packages, http://www.extremefun.ca/ |
| Active Kids Zone | North York | updated | rating 4.5 (320) -> 4.5 (322) | Y | https://activekidszone.com/birthday-parties-2/, http://www.activekidszone.com/ |
| Amazing Fun Park | Mississauga | updated | rating 4.6 (417) -> 4.6 (424) | Y | https://amazingfunpark.ca/parties/, https://amazingfunpark.ca/ |
| Tiny Town Vaughan | Woodbridge | updated | rating 4.4 (470) -> 4.4 (469); price 470 -> 389 | Y | https://tinytownvaughan.ca/parties/, http://www.tinytownvaughan.ca/ |
| The Play Scape | Scarborough | updated | rating 4.7 (269) -> 4.7 (274) | Y | https://theplayscape.ca/packages/, https://theplayscape.ca/ |
| Pixel Pulse Playzone | Vaughan | updated | rating 4.1 (624) -> 4.1 (640) | Y | https://pixelpulseplay.ca/kids-birthday-parties, https://www.pixelpulseplay.ca/ |
| Another World VR Arena Brampton | Brampton | updated | rating 5 (361) -> 5 (429); price - -> 549 | Y | https://brampton.another-world.com/birthday |
| Playplex Game | Markham | updated | rating 4.9 (387) -> 4.9 (438); price 600 -> 500 | Y | https://www.playplexgame.com/party-room, https://www.playplexgame.com/ |
| 🥇 PartyTO | Children's entertainers, Balloons, Bouncy Castle, Photobooth rentals in Toronto |  | updated | rating 4.9 (196) -> 5 (200) | Y | https://www.partyto.ca, https://partyto.ca/ |
| Trapped Scarborough - Escape Room and RC Games Lounge | Scarborough | updated | rating 4.9 (411) -> 4.9 (412) | Y | https://trapped.com/locations/scarborough/book |
| Glama Gal Kids Spa Vaughan | Vaughan | updated | rating 4.8 (223) -> 4.8 (224) | Y | https://www.glamagalparty.com/party-packages, http://www.glamagalkidspa.com/ |
| Bibbity Bobbity Princess Parties | Toronto | updated | rating 5 (281) -> 5 (283) | Y | https://www.bibbitybobbityprincessparties.com, http://bibbitybobbityprincessparties.com/ |
| BenTastic Magic | Vaughan | updated | rating 5 (231) -> 5 (237) | Y | https://magicshowtoronto.com/toronto-birthday-magician-magic, http://www.magicshowtoronto.com/ |
| Creative Playzone | Scarborough | updated | rating 4.8 (326) -> 4.8 (331) | Y | https://www.creativeplayzone.com/party-rooms/, https://creativeplayzone.com/ |
| Another World VR Arena Oakville | Oakville | updated | rating 5 (234) -> 5 (275) | Y | https://oakville.another-world.com/birthday, https://oakville.another-world.com/ |
| Happy Planet Kids Indoor Playground & Party Leaside | East York | updated | rating 4.9 (327) -> 4.9 (382) | Y | https://www.happyplanetca.com/leaside-1 |
| Kidz at Play | Mississauga | updated | rating 4.8 (398) -> 4.8 (401) | Y | https://www.kidzatplay.ca/, http://www.kidzatplay.ca/ |
| Happy Kingdom Brampton | Brampton | updated | rating 4.7 (516) -> 4.7 (554) | Y | https://happykingdombrampton.ca/party/, http://www.happykingdombrampton.ca/ |
| Happy Planet Kids Indoor Playground & Party | Scarborough | updated | rating 4.8 (370) -> 4.8 (374) | Y | https://www.happyplanetca.com/sc |
| Funvilla Oakville | Oakville | updated | rating 4.8 (241) -> 4.8 (264); price - -> 525 | Y | https://funvilla.ca/oakville/parties/, https://funvilla.ca/oakville/tickets/ |
| Kids Empire Heartland Mississauga | Mississauga | updated | rating 4.6 (193) -> 4.6 (235) | Y | https://kidsempire.com, https://www.kidsempire.ca/ |
| VR Escapism Markham - Escape Rooms & Arcades | Markham | updated | rating 4.8 (551) -> 4.8 (556) | Y | https://www.vr-escapism.ca/ |
| Freckles World Children's Party Entertainment | Toronto |  | updated | rating 4.9 (199) -> 4.9 (200); price 299 -> 199 | Y | https://www.frecklesworld.com/, http://www.frecklesworld.com/ |
| Liliput Playhouse | North York | updated | rating 4.7 (369) -> 4.7 (378) | Y | https://www.liliput.ca/party, http://liliput.ca/ |
| Playdium Fairview | North York | updated | rating 4.4 (448) -> 4.4 (462) | Y | https://www.playdium.com/fairview/party, https://www.playdium.com/fairview |
| Another World VR Arena Vaughan | Vaughan | updated | rating 5 (194) -> 5 (213) | Y | https://vaughan.another-world.com/birthday, http://vaughan.another-world.com/ |
| Giggles Playland Inc | Scarborough | updated | rating 4.5 (321) -> 4.5 (325); price - -> 599 | Y | https://www.gigglesplayland.ca/ |
| Doodoo Kids Playground | Markham | updated | rating 4.3 (413) -> 4.3 (421) | Y | https://doodookids.ca/booking/, https://doodookids.ca/ |
| Alpha Kidz Indoor Playground | North York | updated | rating 4.6 (199) -> 4.7 (203) | Y | https://alphakidzplayground.ca/collections/all, https://alphakidzplayground.ca/ |
| Never-Never Land Indoor Playground | Concord | updated | rating 4.6 (258) -> 4.6 (260) | Y | http://neverneverland.co/ |
| ZAK Sports Cricket | Scarborough | updated | rating 4.8 (223) -> 4.8 (229) | Y | https://www.zaksports.ca/, http://www.zaksports.ca/ |
| Vincent Magician for Birthday Parties - Strolling Magician - Magic Shows | Scarborough | updated | rating 4.9 (228) -> 4.9 (227) | Y | https://www.torontosupermagician.com, http://torontosupermagician.com/ |
| Crack Pot Studio | Oakville | updated | rating 4.9 (218) -> 4.9 (220) | Y | http://www.crackpotstudio.com/ |
| Markham Sports Dome Inc. | Markham | updated | rating 4.3 (440) -> 4.3 (444) | Y | http://www.markhamsportsdome.com/ |
| Artventures Toronto Parliament | Toronto | updated | rating 4.9 (216) -> 4.9 (232) | Y | https://artventuresstudios.com/groups%2Fparties, https://www.artventuresstudios.com/ |
| Kidnasium Lawrence Park | Toronto | updated | rating 4.3 (189) -> 4.3 (190) | Y | https://kidnasium.ca/parties, http://kidnasium.ca/ |
| Happy Kingdom Sheppard | Scarborough | updated | rating 4.4 (225) -> 4.4 (245) | Y | https://happykingdomsheppard.ca/party/, https://happykingdomsheppard.ca/ |
| Party Warehouse Outlet & Classic Event Decor | Scarborough | updated | rating 4.2 (218) -> 4.2 (217) | Y | http://www.partywarehouseoutlet.com/ |
| Jolly Bubble Whitby | Whitby | updated | rating 4.8 (114) -> 4.7 (151) | Y | https://thejollybubble.com/whitby-party, https://thejollybubble.com/whitby-home/ |
| Planet Gymnastics Whitby | Whitby | updated | rating 4.8 (91) -> 4.8 (99) | Y | https://planetgymnastics.ca/birthday-parties-1, https://planetgymnastics.ca/ |
| Dish Play Whitby | Whitby | updated | rating 4.7 (46) -> 4.7 (47) | Y | https://www.dishplay.ca/about, http://www.dishplay.ca/ |
| Bloom & Grow Play Space | Whitby | updated | rating 5 (31) -> 5 (32) | Y | https://www.bloomandgrowplayspace.ca/parties, https://www.bloomandgrowplayspace.ca/ |
| Chuck E. Cheese Whitby | Whitby | updated | rating 4.1 (1898) -> 4.1 (1909) | Y | https://www.chuckecheese.com/whitby-on/birthday-parties, https://www.chuckecheese.com/whitby-on |
| Reptilia Whitby | Whitby | updated | rating 4.5 (779) -> 4.5 (791) | Y | https://reptilia.org/birthday-party, https://reptilia.org/admissions/ |
| Sky Zone Trampoline Park Whitby | Whitby | updated | rating 4.4 (2896) -> 4.4 (2904); price - -> 380 | Y | https://www.skyzone.com/ca-whitby/parties, https://www.skyzone.com/ca-whitby/ |
| Flying Squirrel Trampoline Park Whitby | Whitby | updated | rating 4.3 (2024) -> 4.3 (2042); price - -> 300 | Y | https://flyingsquirrelsports.ca/whitby-ontario/parties, https://flyingsquirrelsports.ca/whitby-ontario/ |
| Playdium Whitby | Whitby | updated | rating 4.4 (1603) -> 4.4 (1616) | Y | https://www.playdium.com/whitby/party, https://www.playdium.com/whitby |
| Crock A Doodle Whitby | Whitby | updated | rating 4.7 (346) -> 4.7 (363) | Y | https://crockadoodle.com/whitby/birthday-parties, https://crockadoodle.com/whitby |
| Aspire Climbing Whitby | Whitby | ok | — | Y | https://www.aspireclimbing.com/parties, https://www.aspireclimbing.com/whitby |
| Inflatable Bouncy Castles Whitby | Whitby | ok | — | Y | https://inflatablebouncycastles.ca/ |

## Audit after verification

Every row's summary and overview was checked claim by claim against `data/raw_refresh/crawls/` (and CSV columns from the earlier pipeline). Per-venue counts and source files: `AUDIT_overviews.csv`.

- Rows reviewed: 91. Summaries changed: 47 (the other 44 were already fully supported).
- Overviews: 0 kept unchanged, 91 trimmed, 0 emptied. No overview fell below ~40 supported words, so none were emptied.
- Claims tallied: about 670 kept and 333 removed (counts are the reviewer's tally, not a script output).
- Overview length: 15 overviews are 48 to 59 words, below the 60-word target, because the saved pages support no more real facts. Everything else is 60 to 119 words.
- Review claims now use only the `kid_review_pct` and `rating`/`reviews` columns, phrased plainly. No quoted or paraphrased review content remains.

Verifier WRONG items:
- Extreme Fun: pizza or 24 hot dogs is now stated for the Friday Nite package only.
- Freckles World: 30-minute mini visit from $199 +HST plus $30 travel; 1-hour visits $249 (other 1-hour option $299); 2-hour VIP Princess Party $349. The "90 minutes at $299" and "1-hour from $199" errors are gone. `from_price` stays 199 and is a 30-minute visit, not a full party package; flagged for the user.
- Markham Sports Dome: summary now says 18 months to 12 years (Lil' Strikers / soccer classes), not 14.
- Amazing Fun Park (not in the verifier list): extra child with adult is $49.95 weekday / $59.95 weekend, not "$45 to $60".

Open items for the user (not changed):
- LEGOLAND Discovery Centre: the party page's packages table says Standard $800 (25 guests) and $1,600 (50 guests), while its FAQ says Premium $750 and Ultimate $875 all-inclusive. The overview uses the table; `from_price` 800 may not be the lowest published package.
- Jolly Bubble North York: `party_page_url` points to the Barrhaven party page, not a North York page. The overview says only that no North York package prices are shown.
- Chuck E. Cheese Whitby: `from_price` is stored as 100; the page says $99.99.
- Trapped Scarborough: the saved booking page is a loading shell. The RC games lounge comes from the Google listing name only.
