#!/usr/bin/env python3
"""Launch the Apify Google Maps places scrape for the GTA kids-party niche.

Usage: python3 scripts/apify_run.py
Prints the run id + dataset id. The run takes ~2-5 min; then download with:
  curl -s "https://api.apify.com/v2/datasets/<DATASET_ID>/items?token=$APIFY_API_KEY" -o raw.json
Then: python3 scripts/clean_places.py raw.json places.csv
"""
import json, os, subprocess, sys

ACTOR = "compass~crawler-google-places"

# --- tweak these to expand coverage (new cities, new categories) ---
DEFAULT_CITIES = ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham",
                  "Scarborough", "Oakville", "Pickering", "Richmond Hill", "Ajax",
                  "Newmarket", "Milton", "Whitby"]
# scrape a subset only: PLACES_CITIES='["Whitby"]' python3 scripts/apify_run.py
CITIES = json.loads(os.environ["PLACES_CITIES"]) if os.environ.get("PLACES_CITIES") else DEFAULT_CITIES
CATEGORIES = ["indoor playground", "children's amusement center",
              "kids birthday party venue", "children's party service"]
MAX_PER_SEARCH = 60

def main():
    token = os.environ.get("APIFY_API_KEY")
    if not token:
        sys.exit("APIFY_API_KEY not set")
    searches = [f"{c} in {city}" for city in CITIES for c in CATEGORIES]
    payload = {"searchStringsArray": searches,
               "maxCrawledPlacesPerSearch": MAX_PER_SEARCH,
               "proxyConfig": {"useApifyProxy": True}}
    out = subprocess.run(
        ["curl", "-s", "-X", "POST",
         f"https://api.apify.com/v2/acts/{ACTOR}/runs?token={token}",
         "-H", "Content-Type: application/json", "-d", json.dumps(payload)],
        capture_output=True, text=True).stdout
    run = json.loads(out)["data"]
    print(f"run id: {run['id']}")
    print(f"status: {run['status']}  (poll: curl -s \"https://api.apify.com/v2/acts/{ACTOR}/runs/{run['id']}?token=$APIFY_API_KEY\")")
    print(f"when SUCCEEDED, dataset id: {run['defaultDatasetId']}")

if __name__ == "__main__":
    main()
