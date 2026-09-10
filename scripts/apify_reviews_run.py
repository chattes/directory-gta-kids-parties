#!/usr/bin/env python3
"""Launch the Apify Google reviews scrape for venues in a CSV.

Usage: python3 scripts/apify_reviews_run.py in.csv [max_reviews]
Prints run + dataset id (~$0.01 per venue for 20 reviews). When SUCCEEDED:
  curl -s "https://api.apify.com/v2/datasets/<ID>/items?token=$APIFY_API_KEY" -o reviews.json
Then: python3 scripts/score_reviews.py in.csv reviews.json out.csv
"""
import csv, json, os, subprocess, sys

ACTOR = "compass~Google-Maps-Reviews-Scraper"

def main():
    token = os.environ.get("APIFY_API_KEY")
    if not token: sys.exit("APIFY_API_KEY not set")
    rows = list(csv.DictReader(open(sys.argv[1])))
    max_reviews = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    payload = {"startUrls": [{"url": r["google_maps_url"]} for r in rows],
               "maxReviews": max_reviews, "reviewsSort": "newest", "language": "en"}
    out = subprocess.run(
        ["curl", "-s", "-X", "POST",
         f"https://api.apify.com/v2/acts/{ACTOR}/runs?token={token}",
         "-H", "Content-Type: application/json", "-d", json.dumps(payload)],
        capture_output=True, text=True).stdout
    run = json.loads(out)["data"]
    print(f"run id: {run['id']}\nstatus: {run['status']}")
    print(f"when SUCCEEDED, dataset id: {run['defaultDatasetId']}")

if __name__ == "__main__":
    main()
