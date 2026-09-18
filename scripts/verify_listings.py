#!/usr/bin/env python3
"""Monthly listing-health check: is every venue's website still alive?

READ-ONLY. Never edits data/venues.csv. For each venue with a website:
  1. crawl4ai (local Docker server, localhost:11235) via ~/crawl4ai/crawl.py,
     one URL per call, 5 concurrent. Non-zero exit or empty output = fail.
  2. Retry each crawl4ai failure ONCE.
  3. Fallback: curl -sL (200-399 alive, 404/410 dead, 5xx/000 = unknown),
     retried once. Used when crawl4ai is down or a specific site fails it.

Classification:
  ok      - site clearly alive
  dead    - both methods agree it's gone (or crawl4ai empty + curl 404/410)
  suspect - blocked / timeout / Cloudflare / 5xx — NOT a drop reason by itself
  skipped - no website on record

Usage (from repo root):  python3 scripts/verify_listings.py
Prints a summary and writes data/verify_report.json (gitignored).

Decision rules for the monthly pass:
  dead    -> delete the row from data/venues.csv (the ONLY auto-drop case)
  suspect -> keep; list for human review. Only drop if suspect 2+ months running
  ok      -> nothing
"""
import csv, json, os, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "venues.csv")
REPORT = os.path.join(ROOT, "data", "verify_report.json")

CRAWL_PY = os.path.expanduser("~/crawl4ai/venv/bin/python ~/crawl4ai/crawl.py")
CRAWL_TIMEOUT = 90      # per crawl.py call (its own API timeout is 120s)
CURL_TIMEOUT = 20
WAVE = 5                # concurrent checks
MIN_MARKDOWN = 100      # crawl.py output shorter than this = treat as fail


def check_crawl4ai(url):
    """-> (ok: bool, evidence: str)"""
    try:
        p = subprocess.run(f"{CRAWL_PY} {url}", shell=True, capture_output=True,
                           text=True, timeout=CRAWL_TIMEOUT)
        out = (p.stdout or "").strip()
        if p.returncode == 0 and len(out) >= MIN_MARKDOWN:
            return True, f"crawl4ai ok ({len(out)} chars)"
        err = (p.stderr or "").strip().splitlines()
        return False, f"crawl4ai fail (rc={p.returncode}, out={len(out)} chars){': ' + err[-1][:90] if err else ''}"
    except subprocess.TimeoutExpired:
        return False, f"crawl4ai timeout ({CRAWL_TIMEOUT}s)"
    except Exception as e:
        return False, f"crawl4ai error: {e}"


def check_curl(url):
    """-> (status_bucket, evidence)  bucket in alive/dead/unknown"""
    try:
        p = subprocess.run(["curl", "-sL", "-o", "/dev/null", "-w", "%{http_code}",
                            "--max-time", str(CURL_TIMEOUT), url],
                           capture_output=True, text=True, timeout=CURL_TIMEOUT + 10)
        code = (p.stdout or "").strip()[-3:]
        if code.isdigit() and 200 <= int(code) <= 399:
            return "alive", f"curl {code}"
        if code in ("404", "410"):
            return "dead", f"curl {code}"
        return "unknown", f"curl {code or '000'}"
    except subprocess.TimeoutExpired:
        return "unknown", "curl timeout"
    except Exception as e:
        return "unknown", f"curl error: {e}"


def check_venue(row):
    name, url = row["name"].strip(), (row.get("website") or "").strip()
    if not url:
        return {"name": name, "website": "", "status": "skipped",
                "evidence": "no website on record"}
    if not url.startswith("http"):
        url = "https://" + url

    ev = []
    ok, e = check_crawl4ai(url)
    ev.append(e)
    if not ok:
        ok2, e2 = check_crawl4ai(url)          # retry once
        ev.append("retry: " + e2)
        if not ok2:
            bucket, e3 = check_curl(url)       # fallback
            ev.append(e3)
            if bucket == "alive":
                return {"name": name, "website": url, "status": "ok",
                        "evidence": "; ".join(ev) + " (curl fallback)"}
            if bucket == "dead":
                return {"name": name, "website": url, "status": "dead",
                        "evidence": "; ".join(ev)}
            bucket2, e4 = check_curl(url)      # retry curl once
            ev.append("retry: " + e4)
            if bucket2 == "alive":
                return {"name": name, "website": url, "status": "ok",
                        "evidence": "; ".join(ev) + " (curl fallback)"}
            if bucket2 == "dead":
                return {"name": name, "website": url, "status": "dead",
                        "evidence": "; ".join(ev)}
            return {"name": name, "website": url, "status": "suspect",
                    "evidence": "; ".join(ev)}
    return {"name": name, "website": url, "status": "ok", "evidence": "; ".join(ev)}


def main():
    rows = list(csv.DictReader(open(CSV)))
    print(f"{len(rows)} venues in {CSV}", flush=True)
    results, t0 = [], time.time()
    with ThreadPoolExecutor(max_workers=WAVE) as ex:
        for i, res in enumerate(ex.map(check_venue, rows), 1):
            results.append(res)
            if res["status"] != "ok":
                print(f"  [{i}/{len(rows)}] {res['status']:8} {res['name'][:45]} | {res['evidence'][:90]}", flush=True)
            elif i % 10 == 0:
                print(f"  [{i}/{len(rows)}] ...", flush=True)

    summary = {}
    for r in results:
        summary[r["status"]] = summary.get(r["status"], 0) + 1
    report = {
        "checked_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "venues": len(rows),
        "summary": summary,
        "results": results,
    }
    with open(REPORT, "w") as f:
        json.dump(report, f, indent=1)

    print(f"\n== summary ({int(time.time()-t0)}s): {summary} ==")
    for status in ("dead", "suspect"):
        for r in results:
            if r["status"] == status:
                print(f"  {status:8} {r['name']} | {r['evidence'][:110]}")
    print(f"report -> {REPORT}")
    print("READ-ONLY: no rows were modified. Drop 'dead' rows manually per the vault playbook.")

if __name__ == "__main__":
    main()
