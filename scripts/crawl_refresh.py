#!/usr/bin/env python3
"""Crawl every venue homepage + party page via local crawl4ai, save raw markdown.

Usage: python3 scripts/crawl_refresh.py [--only name1,name2] [--limit N]

Output: data/raw_refresh/crawls/<slug>__home.md, <slug>__party.md
        data/raw_refresh/crawls/manifest.json  (per-URL status + file + chars)
"""
import csv, json, os, re, sys, time

sys.path.insert(0, "/home/chattes/crawl4ai")
from crawl import crawl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "venues.csv")
OUT = os.path.join(ROOT, "data", "raw_refresh", "crawls")
BATCH = 5

def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:60]

def main():
    only = None
    limit = None
    for i, a in enumerate(sys.argv):
        if a == "--only":
            only = set(x.strip().lower() for x in sys.argv[i + 1].split(","))
        if a == "--limit":
            limit = int(sys.argv[i + 1])

    rows = list(csv.DictReader(open(CSV)))
    os.makedirs(OUT, exist_ok=True)
    manifest_path = os.path.join(OUT, "manifest.json")
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}

    jobs = []  # (url, file_key, venue_name)
    for r in rows:
        name = r["name"].strip()
        if only and name.lower() not in only:
            continue
        slug = slugify(name)
        home = (r.get("website") or "").strip()
        party = (r.get("party_page_url") or "").strip()
        if home:
            jobs.append((home, f"{slug}__home", name))
        if party and party != home:
            jobs.append((party, f"{slug}__party", name))
    # skip already-crawled keys unless manifest says failed
    jobs = [j for j in jobs
            if j[1] not in manifest or not manifest[j[1]].get("success")]
    if limit:
        jobs = jobs[:limit]
    print(f"{len(jobs)} URLs to crawl", flush=True)

    done = 0
    for i in range(0, len(jobs), BATCH):
        batch = jobs[i:i + BATCH]
        urls = [j[0] for j in batch]
        try:
            results = crawl(urls)
        except Exception as e:
            print(f"  batch error: {e}", flush=True)
            results = []
        by_url = {}
        for res in results or []:
            by_url[res.get("url")] = res
        for url, key, name in batch:
            res = by_url.get(url)
            md = ""
            ok = False
            err = None
            if res:
                ok = bool(res.get("success"))
                err = res.get("error_message")
                m = res.get("markdown") or {}
                md = m.get("raw_markdown") or (m if isinstance(m, str) else "")
            if ok and len(md) >= 100:
                with open(os.path.join(OUT, key + ".md"), "w") as f:
                    f.write(md)
                manifest[key] = {"url": url, "venue": name, "success": True,
                                 "chars": len(md), "file": key + ".md"}
            else:
                manifest[key] = {"url": url, "venue": name, "success": False,
                                 "chars": len(md or ""), "error": (err or "empty/short")[:200]}
            done += 1
            if not manifest[key]["success"]:
                print(f"  [{done}/{len(jobs)}] FAIL {name} | {url} | {manifest[key].get('error')}", flush=True)
        json.dump(manifest, open(manifest_path, "w"), indent=1)
        print(f"  [{done}/{len(jobs)}] batch saved", flush=True)

    ok_n = sum(1 for v in manifest.values() if v.get("success"))
    print(f"done: {ok_n}/{len(manifest)} URLs ok -> {OUT}")

if __name__ == "__main__":
    main()
