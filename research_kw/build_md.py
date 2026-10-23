import json, csv
HERE = "/home/chattes/Development/gta-refresh/research_kw/"
g = {r["keyword"]: r for r in json.load(open(HERE+"raw/gads_sv_main.json"))["tasks"][0]["result"]}
a = {r["keyword"]: r for r in json.load(open(HERE+"raw/ai_sv_main.json"))["tasks"][0]["result"][0]["items"]}
k = {r["keyword"]: r for r in json.load(open(HERE+"raw/kd_main.json"))["tasks"][0]["result"][0]["items"]}
def gv(kw):
    v = g.get(kw, {}).get("search_volume"); return "not available" if v is None else str(v)
def av(kw):
    v = a.get(kw, {}).get("ai_search_volume"); return "not available" if v is None else str(v)
def kd(kw):
    v = k.get(kw, {}).get("keyword_difficulty"); return "not available" if v is None else str(v)
CITIES = ["Toronto","Mississauga","Whitby","Scarborough","Vaughan","North York","Oakville","Markham","Concord","Brampton","Pickering","Woodbridge","East York","Aurora","GTA"]
PAT = [("best birthday party venues {c}","best venues"),("kids birthday party places {c}","kids places"),
       ("birthday party ideas {c}","ideas"),("indoor birthday party {c}","indoor"),("cheap birthday party places {c}","cheap")]
rows = []
for c in CITIES:
    cl = c.lower()
    cells = []
    for p, _ in PAT:
        kw = p.format(c=cl)
        cells += [gv(kw), av(kw)]
    rows.append("| %s | %s |" % (c, " | ".join(cells)))
hdr = ("| City | best venues vol | best venues AI | kids places vol | kids places AI | ideas vol | ideas AI | indoor vol | indoor AI | cheap vol | cheap AI |\n"
       "|---|---|---|---|---|---|---|---|---|---|---|")
gen_rows = []
for kw in ["birthday party places for kids near me","kids birthday party venues near me","best birthday party places for kids",
           "indoor birthday party places for kids","cheap kids birthday party places","birthday party venues for kids",
           "trampoline park birthday party","birthday party venues for teens","laser tag birthday party toronto",
           "pottery birthday party toronto","bowling birthday party toronto","swimming birthday party toronto",
           "toddler birthday party toronto","birthday party places for teens toronto","birthday party places for 1 year old toronto"]:
    gen_rows.append("| %s | %s | %s | %s |" % (kw, gv(kw), av(kw), kd(kw)))
serp = []
import glob
for f in sorted(glob.glob(HERE+"raw/serp_*.json")):
    d = json.load(open(f)); t = d["tasks"][0]; r = (t["result"] or [{}])[0]
    items = r.get("items") or []
    org = [i for i in items if i["type"] == "organic"]
    top = "; ".join("%s" % (i.get("domain") or "") for i in org[:5])
    aio = "yes" if any(i["type"] == "ai_overview" for i in items) else "no"
    paa = any(i["type"] == "people_also_ask" for i in items)
    lp = "yes" if any(i["type"] == "local_pack" for i in items) else "no"
    kwd = t["data"]["keyword"]
    serp.append("| %s | %s | %s | %s | %s | %s |" % (kwd, gv(kwd), aio, "yes" if paa else "no", lp, top))
cost = sum(float(r["cost_usd"]) for r in csv.DictReader(open(HERE+"costs.csv")))
out = f"""# Best venues by city: keyword and SERP check (Canada, en)

Source: DataForSEO, location 2124 (Canada), language en. Raw JSON in `raw/`. Volumes are monthly Google Ads (`gads_sv_main.json`). AI volume is the DataForSEO AI keyword endpoint (`ai_sv_main.json`). KD is DataForSEO Labs (`kd_main.json`). "not available" means the API returned null. It does not mean zero.

Caveat: Toronto-area city codes were not run. Labs and Ads volume is country-level only (Canada), so city terms match on keyword text only.

## Bottom line

- **Little search traffic exists for "best venues" phrasing.** "best birthday party venues <city>" is 20/mo for Toronto and null everywhere else. "kids birthday party places <city>" is null in Google Ads for every city. AI volume for the core city patterns is 0 to 13 per month (indoor terms reach 25, "best birthday party places for kids" 31). A new `/best-.../<city>/` URL family would target almost no measurable demand.
- **Real volume is in "birthday party ideas <city>" and activity/age terms, and it is national.** Top volumes: "trampoline park birthday party" 210, "birthday party venues for teens" 210 (both mostly non-GTA SERPs), "birthday party ideas toronto" 170, "birthday party ideas mississauga" 50, "cheap birthday party places brampton" 50.
- **Labs KD is almost entirely null** for these terms (5 of 173 returned a value). KD is recorded as not available. Do not treat it as a difficulty signal.
- **Competitor pattern to note:** helpwevegotkids.com already ranks for "Kids' Birthday Party Places in <area>" slugs (West End, East York, Markham, North York, Brampton), in the same format we would use. Our domain does not appear in any of the 10 SERPs captured.

## Keyword table by city (monthly volume, Google Ads / AI)

{hdr}
""" + "\n".join(rows) + f"""

## Generic and activity/age terms

| Keyword | Google Ads vol | AI vol | KD (Labs) |
|---|---|---|---|
""" + "\n".join(gen_rows) + f"""

## SERP check, top 10 (Canada, depth 20)

| Keyword | Google Ads vol | AI Overview | PAA | Local pack | Top 5 organic domains |
|---|---|---|---|---|---|
""" + "\n".join(serp) + f"""

AI Overview cited domains (where text was returned): "birthday party ideas toronto" cites reddit.com, zoumzoumparty.ca, eventsource.ca. "cheap birthday party places brampton" cites facebook.com, bowlero.com. Two other AI Overviews (teens, Mississauga ideas) returned no references.

## Recommendation

1. **Do not create a new `/best-birthday-party-venues/<city>/` URL family.** Volume is not there. The evidence would not justify 14 new pages.
2. **Add a ranked "best venues" section and FAQ to the existing city pages**, starting with Toronto and Mississauga (the two cities with 50+ monthly volume on any city-level pattern). Vaughan (30 for ideas) is next. Brampton only for the cheap-venues angle (50). All other cities are at or below 20 and do not qualify on volume.
3. **Target keywords:** "birthday party ideas toronto", "birthday party ideas mississauga", "cheap birthday party places brampton", "trampoline park birthday party" and "birthday party venues for teens" as GTA-level sub-lists (activity and age pages, if they become a sub-section). The last two are national in their SERPs, so treat them as low-probability for a GTA directory.
4. **Each ranked section must contain:** ranking criteria shown on the page, a short summary per venue (age range, activity, price band from `data/venues.csv` columns), a last-verified date, and an FAQ. Keep the venue facts accurate. The LLM-citation angle here is weak: AI Overviews cite Reddit and Facebook more than venue directories.
5. **Do not spend more** on SERP or Labs calls for this decision. The signal is clear from volume alone.

## Cost

Total spend: **${cost:.4f}** of the USD 1.00 cap (rows in `costs.csv`). The first test call was the same flat Google Ads price per task, so the main set was run as a single task.
"""
open(HERE+"KEYWORDS_best_venues.md", "w").write(out)
print("written", len(out), "bytes; cost", round(cost, 4))
