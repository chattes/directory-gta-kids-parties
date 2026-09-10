#!/usr/bin/env python3
"""Convert the curated CSV into web/lib/data/venues.json for the Next site.

Usage: python3 scripts/build_data.py final.csv
Run from the repo root. After it, rebuild: cd web && npm run build
"""
import csv, json, re, sys, os

def slugify(s):
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', s.lower().strip()))

def main(inp):
    rows = list(csv.DictReader(open(inp)))
    for r in rows:  # fix blank cities from address
        if not (r.get("city") or "").strip():
            m = re.search(r',\s*([A-Za-z .-]+?),\s*(?:ON|Ontario)\b', r.get("address") or '')
            r["city"] = m.group(1).strip() if m else "Toronto"
    venues, seen = [], set()
    for r in rows:
        slug = slugify(r["name"]); base, i = slug, 2
        while slug in seen: slug = f"{base}-{i}"; i += 1
        seen.add(slug)
        venues.append({
            "slug": slug, "name": r["name"].strip(),
            "tags": [t.strip() for t in (r.get("categories") or "").split(";") if t.strip()],
            "address": (r.get("address") or "").strip(), "city": r["city"].strip(),
            "postalCode": (r.get("postal_code") or "").strip(),
            "phone": (r.get("phone") or "").strip(), "website": (r.get("website") or "").strip(),
            "rating": float(r["rating"]) if r.get("rating") else None,
            "reviews": int(r["reviews"]) if r.get("reviews") else 0,
            "priceLevel": (r.get("price_level") or "").strip(),
            "lat": float(r["lat"]) if r.get("lat") else None,
            "lng": float(r["lng"]) if r.get("lng") else None,
            "mapsUrl": (r.get("google_maps_url") or "").strip(),
            "partyDetails": (r.get("party_details") or "").strip(),
            "kidReviewPct": int(r.get("kid_review_pct") or 0),
        })
    venues.sort(key=lambda v: -(v["reviews"] or 0))
    cities = {}
    for v in venues: cities.setdefault(v["city"], []).append(v["slug"])
    out = os.path.join(os.path.dirname(__file__), "..", "web", "lib", "data", "venues.json")
    with open(out, "w") as f:
        json.dump({"venues": venues, "cities": {c: sorted(s) for c, s in sorted(cities.items())}}, f, indent=1)
    print(f"{len(venues)} venues, {len(cities)} cities -> {os.path.abspath(out)}")

if __name__ == "__main__":
    main(sys.argv[1])
