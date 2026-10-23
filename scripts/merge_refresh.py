#!/usr/bin/env python3
"""Merge refresh outputs into data/venues.csv.

- updates rating/reviews from data/raw_refresh/places_full.json (Apify re-scrape)
- adds summary, overview, facts_source_urls, last_verified columns
- applies from_price changes/additions decided in step 2 (evidence in
  data/raw_refresh/price_evidence.txt and crawls)
- fixes Playtopia Vaughan party_page_url (was a CSS link)
- removes Space Centre Vaughan (duplicate Google listing of Space Center Playground)
"""
import csv, json, re, sys

CSV = "data/venues.csv"
CONTENT = "data/raw_refresh/content.jsonl"
PLACES = "data/raw_refresh/places_full.json"
TODAY = "2026-10-23"

# index-based edits, verified against names below
PRICE_SET = {   # index: (expected_name_fragment, new_price or None to clear)
    44: ("Tiny Town Vaughan", "389"),
    48: ("Playplex Game", "500"),
    63: ("Freckles World", "199"),
    30: ("Jump for Joy", "589"),
    36: ("Jolly Bubble North York", None),
    0: ("Jumbaloo", "350"),
    1: ("Aerosports Parks - Scarborough", "399"),
    23: ("Kart Town", "328"),
    24: ("Funday!", "549"),
    34: ("Space Center Playground", "365"),
    37: ("Krafty Kids", "225"),
    47: ("Another World VR Arena Brampton", "549"),
    60: ("Funvilla Oakville", "525"),
    67: ("Giggles Playland", "599"),
    86: ("Sky Zone Trampoline Park Whitby", "380"),
    87: ("Flying Squirrel Trampoline Park Whitby", "300"),
}
REMOVE_IDX = 73  # Space Centre Vaughan duplicate
PLAYTOPIA_IDX = 22

rows = list(csv.DictReader(open(CSV)))
fields = list(rows[0].keys())

content = {}
for line in open(CONTENT):
    d = json.loads(line)
    content[d["name"]] = d

places = {p["placeId"]: p for p in json.load(open(PLACES))}

for i, frag in [(i, f) for i, (f, _) in PRICE_SET.items()] + [(REMOVE_IDX, "Space Centre Vaughan"), (PLAYTOPIA_IDX, "Playtopia")]:
    assert frag in rows[i]["name"], f"index {i}: expected {frag!r}, got {rows[i]['name']!r}"

removed = rows.pop(REMOVE_IDX)
print(f"removed duplicate: {removed['name']} (place_id {removed['place_id']})")

new_fields = fields + ["summary", "overview", "facts_source_urls", "last_verified"]
missing_content, rating_updates = [], 0
for r in rows:
    c = content.get(r["name"])
    if not c:
        missing_content.append(r["name"])
        r["summary"] = r["overview"] = r["facts_source_urls"] = ""
    else:
        r["summary"] = c["summary"]
        r["overview"] = c["overview"]
        r["facts_source_urls"] = ";".join(c["facts_source_urls"])
    r["last_verified"] = TODAY

    p = places.get(r["place_id"])
    if p and p.get("totalScore") is not None:
        new_rating, new_reviews = str(p["totalScore"]), str(p["reviewsCount"])
        if new_rating != r["rating"] or new_reviews != r["reviews"]:
            rating_updates += 1
            r["rating"], r["reviews"] = new_rating, new_reviews

# from_price edits (indices shifted by -1 after removal for rows > 73; all PRICE_SET idx < 73 except 86/87)
for orig_i, (frag, price) in PRICE_SET.items():
    i = orig_i - 1 if orig_i > REMOVE_IDX else orig_i
    r = rows[i]
    assert frag in r["name"], f"{orig_i}: {r['name']}"
    old = r["from_price"]
    r["from_price"] = price or ""
    # keep party_details in sync when it mentions the old package price
    if old and r["party_details"]:
        r["party_details"] = r["party_details"].replace(f"${old}", f"${price}" if price else "")
        r["party_details"] = re.sub(r"Packages from \$\s*(?=\D|$)", "", r["party_details"]).strip(" ·")
    if not old and price and r["party_details"] in ("", "-"):
        r["party_details"] = f"Packages from ${price}"
    print(f"price: {r['name']}: {old or '-'} -> {price or 'CLEARED'}")

pw = rows[PLAYTOPIA_IDX]
pw["party_page_url"] = "http://playtopia.ca/parties"
print(f"fixed party_page_url: {pw['name']} -> {pw['party_page_url']}")

if missing_content:
    print("MISSING CONTENT:", missing_content); sys.exit(1)

with open(CSV, "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=new_fields)
    w.writeheader()
    w.writerows(rows)
print(f"wrote {len(rows)} rows, {rating_updates} rating/review updates")
