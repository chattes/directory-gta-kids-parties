#!/usr/bin/env python3
"""DataForSEO helper: post, save raw JSON, log cost, enforce USD cap. Never prints auth."""
import json, os, time, urllib.request, datetime
HERE = "/home/chattes/Development/gta-refresh/research_kw"
B64 = os.environ["DATAFORSEO_B64"]
BASE = "https://api.dataforseo.com/v3"
CAP = 1.00
COSTS = os.path.join(HERE, "costs.csv")

def spent():
    if not os.path.exists(COSTS): return 0.0
    rows = open(COSTS).read().splitlines()[1:]
    return sum(float(r.split(",")[5]) for r in rows if r.strip())

def call(name, path, payload, location, nkw, notes):
    """Returns parsed response. Skips if raw file exists with status 20000."""
    out = os.path.join(HERE, "raw", name + ".json")
    if os.path.exists(out):
        prev = json.load(open(out))
        if prev.get("status_code") == 20000:
            print(name, "SKIP cached"); return prev
    est_left = CAP - spent()
    if est_left < 0.05:
        raise SystemExit("Budget guard: spent=%.4f, stopping" % spent())
    req = urllib.request.Request(BASE + path, data=json.dumps(payload).encode(),
        headers={"Authorization": "Basic " + B64, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=240) as r:
        resp = json.loads(r.read())
    json.dump(resp, open(out, "w"))
    cost = resp.get("cost") or 0
    if not os.path.exists(COSTS):
        open(COSTS, "w").write("timestamp,endpoint,location,tasks,keywords,cost_usd,notes\n")
    with open(COSTS, "a") as f:
        f.write("%s,%s,%s,%d,%d,%.6f,%s\n" % (datetime.date.today().isoformat(), path.lstrip("/"),
                location, len(payload), nkw, cost, notes))
    print("%s status=%s cost=$%.6f total_spent=$%.4f" % (name, resp.get("status_code"), cost, spent()))
    if resp.get("status_code") != 20000:
        print("  !!", resp.get("status_message"))
    time.sleep(1.0)
    return resp
