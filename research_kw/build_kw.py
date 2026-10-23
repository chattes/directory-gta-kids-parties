import json
CITIES = ["Toronto","Mississauga","Whitby","Scarborough","Vaughan","North York","Oakville","Markham","Concord","Brampton","Pickering","Woodbridge","East York","Aurora","GTA"]
PATTERNS = ["best birthday party venues {c}","kids birthday party places {c}","birthday party ideas {c}",
            "kids party venues {c}","indoor birthday party {c}","cheap birthday party places {c}"]
EXTRA_CITY = ["trampoline birthday party {c}","bowling birthday party {c}","laser tag birthday party {c}",
              "pottery birthday party {c}","swimming birthday party {c}","birthday party places for 1 year old {c}",
              "toddler birthday party {c}","birthday party places for teens {c}"]
GENERIC = ["birthday party places for kids near me","kids birthday party venues near me",
           "best birthday party places for kids","indoor birthday party places for kids",
           "cheap kids birthday party places","birthday party venues for kids","kids birthday party places toronto area",
           "trampoline park birthday party","laser tag birthday party toronto","pottery birthday party toronto",
           "best kids birthday venues gta","birthday party places for toddlers","birthday party venues for teens"]
kws = []
for c in CITIES:
    cl = c.lower()
    for p in PATTERNS: kws.append(p.format(c=cl))
for c in ["Toronto","Mississauga","Vaughan","Markham","Brampton","Oakville","North York","Scarborough","GTA"]:
    for p in EXTRA_CITY: kws.append(p.format(c=c.lower()))
kws += GENERIC
kws = list(dict.fromkeys(kws))
json.dump(kws, open("keywords_input.json","w"), indent=1)
print(len(kws))
