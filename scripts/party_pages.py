#!/usr/bin/env python3
"""Deep-crawl venue sites for dedicated birthday/party pages; extract package details.

Usage: python3 scripts/party_pages.py in.csv out.csv
Adds columns: party_page_url, party_page_status, party_details.
"""
import csv, re, sys, urllib.request, ssl, urllib.parse, concurrent.futures as cf

LINK_RE = re.compile(r'href=["\']([^"\']+)["\'][^>]*>(?:(?!</a>).){0,60}(?:birthday|parties|party)', re.I | re.S)
CTX = ssl.create_default_context(); CTX.check_hostname = False; CTX.verify_mode = ssl.CERT_NONE
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def fetch(url, limit=500000):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=12, context=CTX) as r:
        return r.read(limit).decode("utf-8", "ignore"), r.geturl()

def info_from(html):
    text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html))
    out = {}
    prices = re.findall(r'\$\s?\d{2,4}', text)
    if prices: out['prices'] = sorted(set(prices))[:5]
    m = re.search(r'(\d{2,3})\s*(?:kids|children|guests)', text, re.I)
    if m: out['capacity'] = m.group(1)
    m = re.search(r'(\d\.?\d*)\s*(?:hours?|hrs?)\b', text, re.I)
    if m: out['duration'] = m.group(0)
    m = re.search(r'(?:ages?|kids?)\s*(\d{1,2}\s*(?:-|to|–)\s*\d{1,2})', text, re.I)
    if m: out['ages'] = m.group(1)
    return out

def deep_check(row):
    base = (row.get("website") or "").strip()
    if not base.startswith("http"): base = "https://" + base
    try:
        html, final = fetch(base)
    except Exception:
        return row, "", "site_unreachable", {}
    m = LINK_RE.search(html)
    if m:
        page = urllib.parse.urljoin(final, m.group(1))
        try:
            phtml, _ = fetch(page)
            return row, page, "party_page_found", info_from(phtml)
        except Exception:
            return row, page, "party_page_error", {}
    if "birthday" in html.lower():
        return row, final, "homepage_mentions_birthday", info_from(html)
    return row, "", "no_party_page", {}

def main(inp, outp):
    rows = list(csv.DictReader(open(inp)))
    results = []
    with cf.ThreadPoolExecutor(max_workers=20) as ex:
        futs = [ex.submit(deep_check, r) for r in rows]
        for f in cf.as_completed(futs): results.append(f.result())
    fields = list(rows[0].keys()) + ["party_page_url", "party_page_status", "party_details"]
    with open(outp, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields); w.writeheader()
        for row, page, status, info in results:
            row["party_page_url"], row["party_page_status"] = page, status
            row["party_details"] = "; ".join(
                f"{k}: {', '.join(v) if isinstance(v, list) else v}" for k, v in info.items())
            w.writerow(row)
    from collections import Counter
    print(f"{dict(Counter(s for _, _, s, _ in results))} -> {outp}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
