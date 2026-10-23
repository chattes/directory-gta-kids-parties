#!/usr/bin/env python3
"""Extract price-bearing sentences from crawled party-page markdown.

Usage: python3 scripts/price_evidence.py > data/raw_refresh/price_evidence.txt

For every venue with a from_price in data/venues.csv, prints the saved crawl
sentences containing '$' so each published price can be re-verified by hand.
"""
import csv, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "venues.csv")
CRAWLS = os.path.join(ROOT, "data", "raw_refresh", "crawls")

def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:60]

def price_sentences(path):
    if not os.path.exists(path):
        return None
    text = open(path, encoding="utf-8", errors="ignore").read()
    text = re.sub(r"\s+", " ", text)
    # split into sentence-ish chunks
    chunks = re.split(r"(?<=[.!?])\s+|\n", text)
    hits = [c.strip() for c in chunks if "$" in c and re.search(r"\$\s?\d", c)]
    # drop obvious nav/boilerplate noise, keep it short
    return [h[:220] for h in hits if len(h) > 8]

def main():
    rows = list(csv.DictReader(open(CSV)))
    for r in rows:
        fp = r["from_price"].strip()
        if not fp:
            continue
        slug = slugify(r["name"])
        print(f"\n### {r['name']}  (from_price={fp})")
        for kind in ("party", "home"):
            p = os.path.join(CRAWLS, f"{slug}__{kind}.md")
            hits = price_sentences(p)
            if hits is None:
                print(f"  [{kind}] NO CRAWL FILE")
            elif not hits:
                print(f"  [{kind}] no $ sentences found")
            else:
                print(f"  [{kind}] {r['party_page_url'] if kind=='party' else r['website']}")
                for h in hits[:12]:
                    print(f"    - {h}")

if __name__ == "__main__":
    main()
