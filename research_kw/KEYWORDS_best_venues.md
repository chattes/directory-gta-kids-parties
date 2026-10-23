# Best venues by city: keyword and SERP check (Canada, en)

Source: DataForSEO, location 2124 (Canada), language en. Raw JSON in `raw/`. Volumes are monthly Google Ads (`gads_sv_main.json`). AI volume is the DataForSEO AI keyword endpoint (`ai_sv_main.json`). KD is DataForSEO Labs (`kd_main.json`). "not available" means the API returned null. It does not mean zero.

Caveat: Toronto-area city codes were not run. Labs and Ads volume is country-level only (Canada), so city terms match on keyword text only.

## Bottom line

- **Little search traffic exists for "best venues" phrasing.** "best birthday party venues <city>" is 20/mo for Toronto and null everywhere else. "kids birthday party places <city>" is null in Google Ads for every city. AI volume for the core city patterns is 0 to 13 per month (indoor terms reach 25, "best birthday party places for kids" 31). A new `/best-.../<city>/` URL family would target almost no measurable demand.
- **Real volume is in "birthday party ideas <city>" and activity/age terms, and it is national.** Top volumes: "trampoline park birthday party" 210, "birthday party venues for teens" 210 (both mostly non-GTA SERPs), "birthday party ideas toronto" 170, "birthday party ideas mississauga" 50, "cheap birthday party places brampton" 50.
- **Labs KD is almost entirely null** for these terms (5 of 173 returned a value). KD is recorded as not available. Do not treat it as a difficulty signal.
- **Competitor pattern to note:** helpwevegotkids.com already ranks for "Kids' Birthday Party Places in <area>" slugs (West End, East York, Markham, North York, Brampton), in the same format we would use. Our domain does not appear in any of the 10 SERPs captured.

## Keyword table by city (monthly volume, Google Ads / AI)

| City | best venues vol | best venues AI | kids places vol | kids places AI | ideas vol | ideas AI | indoor vol | indoor AI | cheap vol | cheap AI |
|---|---|---|---|---|---|---|---|---|---|---|
| Toronto | 20 | 0 | not available | 3 | 170 | 10 | 10 | 19 | not available | 0 |
| Mississauga | not available | 0 | not available | 13 | 50 | 0 | 10 | 25 | not available | 0 |
| Whitby | not available | 0 | not available | 0 | 20 | 0 | not available | 3 | not available | 0 |
| Scarborough | not available | 0 | not available | 4 | not available | 0 | not available | 2 | not available | 0 |
| Vaughan | not available | 0 | not available | 4 | 30 | 0 | not available | 0 | not available | 0 |
| North York | not available | 0 | not available | 3 | not available | 0 | not available | 0 | not available | 0 |
| Oakville | not available | 0 | not available | 0 | 20 | 5 | not available | 0 | not available | 0 |
| Markham | not available | 0 | not available | 0 | 20 | 0 | not available | 5 | not available | 0 |
| Concord | not available | 0 | not available | 0 | not available | 0 | not available | 0 | not available | 0 |
| Brampton | not available | 0 | not available | 0 | 20 | 0 | not available | 0 | 50 | 0 |
| Pickering | not available | 0 | not available | 0 | not available | 0 | not available | 0 | not available | 0 |
| Woodbridge | not available | 0 | not available | 0 | not available | 0 | not available | 0 | not available | 0 |
| East York | not available | 0 | not available | 0 | not available | 0 | not available | 0 | not available | 0 |
| Aurora | not available | 0 | not available | 0 | not available | 0 | not available | 0 | not available | 0 |
| GTA | not available | 0 | not available | 0 | 10 | 0 | not available | 0 | not available | 0 |

## Generic and activity/age terms

| Keyword | Google Ads vol | AI vol | KD (Labs) |
|---|---|---|---|
| birthday party places for kids near me | not available | 0 | not available |
| kids birthday party venues near me | not available | 0 | not available |
| best birthday party places for kids | not available | 31 | not available |
| indoor birthday party places for kids | not available | 3 | not available |
| cheap kids birthday party places | not available | 0 | not available |
| birthday party venues for kids | not available | 30 | not available |
| trampoline park birthday party | 210 | 3 | 0 |
| birthday party venues for teens | 210 | 0 | not available |
| laser tag birthday party toronto | 20 | 6 | 0 |
| pottery birthday party toronto | 20 | 0 | not available |
| bowling birthday party toronto | 20 | 0 | not available |
| swimming birthday party toronto | 10 | 0 | not available |
| toddler birthday party toronto | not available | 4 | not available |
| birthday party places for teens toronto | not available | 0 | not available |
| birthday party places for 1 year old toronto | not available | 0 | not available |

## SERP check, top 10 (Canada, depth 20)

| Keyword | Google Ads vol | AI Overview | PAA | Local pack | Top 5 organic domains |
|---|---|---|---|---|---|
| best birthday party venues toronto | 20 | no | no | yes | www.therecroom.com; karttown.ca; echoage.com; bokplaycafe.com; www.savvymom.ca |
| trampoline park birthday party | 210 | no | yes | yes | flyingsquirrelsports.ca; funparkcanada.ca; www.airriderz.com; www.edmonton.family; funparkcanada.ca |
| birthday party ideas toronto | 170 | yes | yes | yes | www.reddit.com; thechefupstairs.com; www.k1speed.ca; on.mosaicartstudio.ca; bokplaycafe.com |
| birthday party venues for teens | 210 | yes | yes | yes | superiorstudios.ca; simplyplaykids.ca; www.yelp.ca; modernmama.com; www.facebook.com |
| laser tag birthday party toronto | 20 | no | no | yes | www.reddit.com; planetlaser.ca; www.instagram.com; www.chatterblock.com; www.yelp.ca |
| kids birthday party places mississauga | not available | no | no | yes | www.chatterblock.com; www.airriderz.com; amazingadventuresplayland.ca; www.yelp.ca; www.instagram.com |
| birthday party places for kids near me | not available | no | yes | yes | www.zoumzoumparty.ca; www.mapping-winnipeg.com; echoage.com; activeparents.ca; toronto.kidsoutandabout.com |
| cheap birthday party places brampton | 50 | yes | yes | yes | crockadoodle.com; www.facebook.com; www.reddit.com; www.peerspace.com; www.facebook.com |
| birthday party ideas mississauga | 50 | yes | yes | no | bricks4kidz.ca; crookedcue.ca; www.instagram.com; www.yelp.ca; www.airriderz.com |
| indoor birthday party toronto | 10 | no | no | yes | bokplaycafe.com; karttown.ca; www.tagvenue.com; www.liliput.ca; bokplaycafe.com |

AI Overview cited domains (where text was returned): "birthday party ideas toronto" cites reddit.com, zoumzoumparty.ca, eventsource.ca. "cheap birthday party places brampton" cites facebook.com, bowlero.com. Two other AI Overviews (teens, Mississauga ideas) returned no references.

## Recommendation

1. **Do not create a new `/best-birthday-party-venues/<city>/` URL family.** Volume is not there. The evidence would not justify 14 new pages.
2. **Add a ranked "best venues" section and FAQ to the existing city pages**, starting with Toronto and Mississauga (the two cities with 50+ monthly volume on any city-level pattern). Vaughan (30 for ideas) is next. Brampton only for the cheap-venues angle (50). All other cities are at or below 20 and do not qualify on volume.
3. **Target keywords:** "birthday party ideas toronto", "birthday party ideas mississauga", "cheap birthday party places brampton", "trampoline park birthday party" and "birthday party venues for teens" as GTA-level sub-lists (activity and age pages, if they become a sub-section). The last two are national in their SERPs, so treat them as low-probability for a GTA directory.
4. **Each ranked section must contain:** ranking criteria shown on the page, a short summary per venue (age range, activity, price band from `data/venues.csv` columns), a last-verified date, and an FAQ. Keep the venue facts accurate. The LLM-citation angle here is weak: AI Overviews cite Reddit and Facebook more than venue directories.
5. **Do not spend more** on SERP or Labs calls for this decision. The signal is clear from volume alone.

## Cost

Total spend: **$0.2928** of the USD 1.00 cap (rows in `costs.csv`). The first test call was the same flat Google Ads price per task, so the main set was run as a single task.
