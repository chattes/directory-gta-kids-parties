#!/usr/bin/env python3
"""Verify each venue's website for birthday/party evidence.

Usage: python3 scripts/verify_sites.py in.csv out.csv
Adds columns: party_signal (yes/no/unknown), party_evidence (page snippet).
"""
import csv, re, sys, urllib.request, ssl, concurrent.futures as cf

PARTY_KW = re.compile(r'birthday|party package|parties|celebrat|private (event|party)|group (event|booking)|host a party', re.I)
CTX = ssl.create_default_context(); CTX.check_hostname = False; CTX.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def check(row):
    url = (row.get("website") or "").strip()
    if not url: return row, "unknown", ""
    if not url.startswith("http"): url = "https://" + url
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=10, context=CTX) as r:
            html = r.read(400000).decode("utf-8", "ignore")
        m = PARTY_KW.search(html)
        if m:
            i = max(0, m.start() - 60)
            snip = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html[i:m.end() + 60]))[:140]
            return row, "yes", snip
        return row, "no", ""
    except Exception:
        return row, "unknown", ""

def main(inp, outp):
    rows = list(csv.DictReader(open(inp)))
    results = []
    with cf.ThreadPoolExecutor(max_workers=24) as ex:
        results = list(ex.map(check, rows))
    fields = list(rows[0].keys()) + ["party_signal", "party_evidence"]
    with open(outp, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields); w.writeheader()
        for row, sig, ev in results:
            row["party_signal"], row["party_evidence"] = sig, ev
            w.writerow(row)
    from collections import Counter
    print(f"party_signal: {dict(Counter(s for _, s, _ in results))} -> {outp}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
