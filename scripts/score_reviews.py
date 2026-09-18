#!/usr/bin/env python3
"""Score venues using scraped Google reviews; flag ones that look bad for kids.

Usage: python3 scripts/score_reviews.py in.csv reviews.json out.csv
Keeps: rating >= 4.0, >= 15 reviews, complaint rate < 25%, recent avg >= 3.8,
no adult-focused venue with zero kid mentions. Adds kid_review_pct,
recent_avg_stars, review_red_flags. Review the flag list before trusting drops.
"""
import csv, json, os, re, sys
from collections import defaultdict

KID_RE = re.compile(r'\b(kid|kids|child|children|birthday|party|toddler|son|daughter|niece|nephew)\b', re.I)
NEG_RE = re.compile(r'(dirty|filthy|rude|unsafe|injur|refund|cancelled|canceled|rip.?off|overpriced|never again|disappoint|waste of money|broken equipment|rough)', re.I)
ADULT_RE = re.compile(r'\b(bar|nightclub|19\+|adults only|craft drinks|cocktail)\b', re.I)

MIN_RATING = float(os.environ.get("MIN_RATING", 4.0))
MIN_REVIEWS = int(os.environ.get("MIN_REVIEWS", 15))
MAX_NEG_PCT = float(os.environ.get("MAX_NEG_PCT", 25))
MIN_RECENT_AVG = float(os.environ.get("MIN_RECENT_AVG", 3.8))

def main(inp, revjson, outp):
    top = list(csv.DictReader(open(inp)))
    reviews = json.load(open(revjson))
    by_place = defaultdict(list)
    for rv in reviews: by_place[rv.get("placeId")].append(rv)

    kept, flagged = [], []
    for r in top:
        rvs = by_place.get(r["place_id"], [])
        n = len(rvs)
        kid = sum(1 for v in rvs if KID_RE.search(v.get("text") or ""))
        neg = [v for v in rvs if (v.get("stars") or 5) <= 2 or NEG_RE.search(v.get("text") or "")]
        stars = [v.get("stars") for v in rvs if v.get("stars")]
        r["kid_review_pct"] = round(100 * kid / n) if n else 0
        r["recent_avg_stars"] = round(sum(stars) / len(stars), 1) if stars else ""
        r["review_red_flags"] = "; ".join(sorted({(v.get("text") or "")[:70] for v in neg[:3]}))
        reasons = []
        if float(r["rating"] or 0) < MIN_RATING: reasons.append(f"rating {r['rating']}")
        if int(r["reviews"] or 0) < MIN_REVIEWS: reasons.append("few reviews")
        if n and round(100 * len(neg) / n) >= MAX_NEG_PCT: reasons.append(f"{round(100*len(neg)/n)}% complaints")
        if n and r["recent_avg_stars"] != "" and r["recent_avg_stars"] < MIN_RECENT_AVG: reasons.append(f"recent {r['recent_avg_stars']}*")
        if n and r["kid_review_pct"] == 0 and ADULT_RE.search(r["name"] + " " + (r.get("party_evidence") or "")):
            reasons.append("adult venue")
        (flagged if reasons else kept).append((r, reasons))

    fields = list(top[0].keys())
    with open(outp, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields); w.writeheader()
        for r, _ in flagged + kept: w.writerow(r)
    print(f"kept {len(kept)} | flagged {len(flagged)} (review out.csv, flagged rows have reasons in notes below)")
    for r, reasons in flagged:
        print(f"  FLAG {r['name']}: {'; '.join(reasons)}")
    print("-> manually delete flagged rows you agree with, keep the rest")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
