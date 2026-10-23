#!/usr/bin/env python3
"""Re-scrape existing venue place_ids via Apify compass/crawler-google-places.

Usage:
  python3 scripts/places_refresh.py --test          # first 3 place_ids only
  python3 scripts/places_refresh.py                 # all place_ids

Saves raw dataset items to data/raw_refresh/places_<tag>.json and prints the
run's usage cost (usageTotalUsd) so it can be logged to data/costs_refresh.csv.
"""
import csv, json, os, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "venues.csv")
RAW_DIR = os.path.join(ROOT, "data", "raw_refresh")
ACTOR = "compass~crawler-google-places"

def api(method, path, token, payload=None):
    cmd = ["curl", "-s", "-X", method,
           f"https://api.apify.com/v2/{path}{'&' if '?' in path else '?'}token={token}",
           "-H", "Content-Type: application/json"]
    if payload is not None:
        cmd += ["-d", json.dumps(payload)]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    return json.loads(out)

def main():
    test = "--test" in sys.argv
    token = os.environ.get("APIFY_API_KEY")
    if not token:
        sys.exit("APIFY_API_KEY not set")

    rows = list(csv.DictReader(open(CSV)))
    place_ids = [r["place_id"].strip() for r in rows if r.get("place_id", "").strip()]
    if test:
        place_ids = place_ids[:3]
    tag = "test" if test else "full"
    print(f"{len(place_ids)} place_ids ({tag} run)", flush=True)

    payload = {"placeIds": place_ids,
               "maxCrawledPlacesPerSearch": 1,
               "proxyConfig": {"useApifyProxy": True}}
    run = api("POST", f"acts/{ACTOR}/runs", token, payload)["data"]
    run_id, ds_id = run["id"], run["defaultDatasetId"]
    print(f"run id: {run_id}  dataset: {ds_id}", flush=True)

    while True:
        time.sleep(15)
        r = api("GET", f"actor-runs/{run_id}", token)["data"]
        status = r["status"]
        print(f"  status: {status}", flush=True)
        if status in ("SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"):
            break

    cost = r.get("usageTotalUsd")
    items = api("GET", f"datasets/{ds_id}/items?clean=true", token)
    os.makedirs(RAW_DIR, exist_ok=True)
    out_path = os.path.join(RAW_DIR, f"places_{tag}.json")
    json.dump(items, open(out_path, "w"), indent=1)
    print(f"status={status} items={len(items)} usageTotalUsd={cost}")
    print(f"saved -> {out_path}")

if __name__ == "__main__":
    main()
