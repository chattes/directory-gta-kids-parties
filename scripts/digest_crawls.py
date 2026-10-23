#!/usr/bin/env python3
"""Build compact per-venue digests from saved crawl markdown.

Usage: python3 scripts/digest_crawls.py [start] [end]  (index range, default all)

Prints, per venue: homepage/party-page text with markdown boilerplate stripped,
prioritizing sentences mentioning birthday/party/package/price/ages/hours/kids.
Used as source material for writing summary/overview columns.
"""
import csv, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "venues.csv")
CRAWLS = os.path.join(ROOT, "data", "raw_refresh", "crawls")

KEY = re.compile(r"birthday|part(y|ies)|package|per child|per kid|guest|\$\s?\d|"
                 r"ages?\b|\bkids?\b|children|hour|hr\b|include|room|pizza|"
                 r"capacity|up to \d|book", re.I)

def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:60]

def clean(md, budget):
    # drop images, then links keep text
    md = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", md)
    md = re.sub(r"\[([^\]]*)\]\((?:https?://|tel:|mailto:)[^)]*\)", r"\1", md)
    md = re.sub(r"\]\(([^)]*)\)", " ", md)  # leftover reference-style
    md = re.sub(r"[#*|>`\-]{1,}(?=\s|$)", " ", md)
    lines = [re.sub(r"\s+", " ", l).strip() for l in md.splitlines()]
    lines = [l for l in lines if len(l) > 3 and not re.fullmatch(r"[\W_]+", l)]
    seen, keep, extra = set(), [], []
    for l in lines:
        k = l.lower()[:80]
        if k in seen:
            continue
        seen.add(k)
        (keep if KEY.search(l) else extra).append(l)
    out = "\n".join(keep + extra)
    return out[:budget]

def main():
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    end = int(sys.argv[2]) if len(sys.argv) > 2 else None
    rows = list(csv.DictReader(open(CSV)))[start:end]
    manifest = json.load(open(os.path.join(CRAWLS, "manifest.json")))
    for i, r in enumerate(rows, start):
        slug = slugify(r["name"])
        print(f"\n{'='*90}\n[{i}] {r['name']} | {r['city']} | {r['categories'][:60]}")
        print(f"    rating {r['rating']} ({r['reviews']} rev) | kid_pct {r['kid_review_pct']} | from_price {r['from_price'] or '-'} | details: {r['party_details'] or '-'}")
        for kind in ("party", "home"):
            key = f"{slug}__{kind}"
            m = manifest.get(key, {})
            path = os.path.join(CRAWLS, key + ".md")
            if not m.get("success") or not os.path.exists(path):
                print(f"  --- {kind}: NO CRAWL ({m.get('error','not run')})")
                continue
            budget = 3500 if kind == "party" else 1800
            print(f"  --- {kind}: {m['url']}")
            print(clean(open(path, encoding="utf-8", errors="ignore").read(), budget))

if __name__ == "__main__":
    main()
