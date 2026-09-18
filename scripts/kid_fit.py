#!/usr/bin/env python3
"""Compute the deterministic "Kid-Fit" score (1-5) for every venue.

Reads data/venues.csv, adds/updates the `kid_fit` column (right after
`kid_review_pct`), writes the CSV back. Same CSV in -> same scores out;
there is no subjective input.

Formula:
  base from kid_review_pct (percent value, e.g. 20 = 20% of recent Google
  reviews mentioning kids):
      >= 65 -> 5      >= 45 -> 4      >= 25 -> 3      >= 10 -> 2      else -> 1
      empty/missing -> 3
  +1 if from_price is non-empty (a verified published party package means
      the venue is kid-proven). Final result capped at 5, clamped to 1-5.

Usage (from repo root):  python3 scripts/kid_fit.py
Prints the score distribution (count per score 1-5).
"""
import csv, os, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "venues.csv")


def base_score(pct_raw):
    pct = (pct_raw or "").strip()
    if not pct:
        return 3
    p = int(float(pct))
    if p >= 65: return 5
    if p >= 45: return 4
    if p >= 25: return 3
    if p >= 10: return 2
    return 1


def kid_fit(row):
    s = base_score(row.get("kid_review_pct"))
    if (row.get("from_price") or "").strip():
        s += 1
    return max(1, min(5, s))


def main():
    rows = list(csv.DictReader(open(CSV)))
    fields = list(rows[0].keys())
    if "kid_fit" not in fields:
        i = fields.index("kid_review_pct")
        fields = fields[:i+1] + ["kid_fit"] + fields[i+1:]
    dist = Counter()
    for r in rows:
        r["kid_fit"] = str(kid_fit(r))
        dist[r["kid_fit"]] += 1
    with open(CSV, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print(f"{len(rows)} venues scored -> {CSV}")
    for s in ("1", "2", "3", "4", "5"):
        print(f"  kid_fit {s}: {dist.get(s, 0)} venues")
    ones = [r["name"] for r in rows if r["kid_fit"] == "1"]
    if ones:
        print("score-1 venues (worth eyeballing): " + "; ".join(ones))

if __name__ == "__main__":
    main()
