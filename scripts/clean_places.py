#!/usr/bin/env python3
"""Clean a raw Apify places dataset into a deduped, GTA-only, party-relevant CSV.

Usage: python3 scripts/clean_places.py raw.json places.csv
(raw.json = dataset items downloaded from Apify)
"""
import csv, json, re, sys

KEEP_CATS = {"children's party service", "indoor playground", "children's amusement center",
             "playground", "amusement center", "video arcade", "recreation center",
             "children's club", "children's camp", "soft play", "trampoline park",
             "sports complex", "bowling alley", "miniature golf course", "ice skating rink",
             "swimming pool", "art studio", "pottery classes", "cooking school",
             "dance hall", "entertainer", "magician", "balloon artist", "event venue", "banquet hall"}

def in_gta(lat, lng):
    return lat is not None and lng is not None and 43.35 <= lat <= 44.25 and -80.30 <= lng <= -78.85

def parse_city(addr, fallback):
    if fallback: return fallback
    m = re.search(r',\s*([A-Za-z .-]+?),\s*(?:ON|Ontario)\b', addr or '')
    return m.group(1).strip() if m else ""

def main(inp, outp):
    items = json.load(open(inp))
    seen, rows, stats = {}, [], {"closed": 0, "gta": 0, "cat": 0}
    for it in items:
        pid = it.get("placeId")
        if not pid or pid in seen: continue
        if it.get("permanentlyClosed") or it.get("temporarilyClosed"): stats["closed"] += 1; continue
        cats = [c.lower() for c in (it.get("categories") or [])]
        if not (KEEP_CATS & set(cats)): stats["cat"] += 1; continue
        loc = it.get("location") or {}
        lat, lng = loc.get("lat"), loc.get("lng")
        if not in_gta(lat, lng): stats["gta"] += 1; continue
        seen[pid] = True
        rows.append({
            "name": it.get("title", ""), "categories": "; ".join(it.get("categories") or []),
            "address": it.get("address", ""), "city": parse_city(it.get("address"), it.get("city")),
            "postal_code": it.get("postalCode", ""),
            "phone": it.get("phoneUnformatted") or it.get("phone") or "",
            "website": it.get("website") or "", "rating": it.get("totalScore"),
            "reviews": it.get("reviewsCount"), "price_level": it.get("price"),
            "lat": lat, "lng": lng, "place_id": pid, "google_maps_url": it.get("url", ""),
        })
    rows.sort(key=lambda r: -(r["reviews"] or 0))
    with open(outp, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
    print(f"{len(rows)} venues -> {outp} | dropped: {stats['closed']} closed, "
          f"{stats['cat']} wrong-category, {stats['gta']} outside-GTA, "
          f"{len(items)-len(seen)-sum(stats.values())} duplicates")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
