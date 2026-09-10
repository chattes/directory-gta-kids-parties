#!/usr/bin/env python3
"""Generate Pinterest pins (1000x1500) for city pages + homepage.

Usage: python3 scripts/make_pins.py
Reads web/lib/data/venues.json + photos in assets/pins/photos/,
writes pins to assets/pins/ and a copy-paste sheet to assets/pins/pins.md.
"""
import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(__file__), "..")
PINS = os.path.join(ROOT, "assets", "pins")
PHOTOS = os.path.join(PINS, "photos")

CORAL = (224, 73, 47)
CREAM = (255, 248, 240)
INK = (43, 33, 24)
MUTED = (107, 93, 79)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

W, H = 1000, 1500
PHOTO_H = 760

def font(path, size):
    return ImageFont.truetype(path, size)

def wrap(text, fnt, max_w, draw):
    words, lines, cur = text.split(), [], ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if draw.textlength(t, font=fnt) <= max_w: cur = t
        else: lines.append(cur); cur = w_
    if cur: lines.append(cur)
    return lines

def cover_crop(im, tw, th):
    w, h = im.size
    scale = max(tw / w, th / h)
    im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    x, y = (im.width - tw) // 2, (im.height - th) // 2
    return im.crop((x, y, x + tw, y + th))

def make_pin(photo, headline, subline, footer, out):
    pin = Image.new("RGB", (W, H), CREAM)
    img = Image.open(photo).convert("RGB")
    pin.paste(cover_crop(img, W, PHOTO_H), (0, 0))

    d = ImageDraw.Draw(pin)
    # headline
    f_head = font(FONT_BOLD, 78)
    y = PHOTO_H + 70
    for line in wrap(headline, f_head, W - 140, d):
        d.text(((W - d.textlength(line, font=f_head)) / 2, y), line, font=f_head, fill=INK)
        y += 96
    # subline
    f_sub = font(FONT_REG, 38)
    y += 26
    for line in wrap(subline, f_sub, W - 180, d):
        d.text(((W - d.textlength(line, font=f_sub)) / 2, y), line, font=f_sub, fill=MUTED)
        y += 52
    # footer bar
    d.rectangle([0, H - 110, W, H], fill=CORAL)
    f_foot = font(FONT_BOLD, 40)
    d.text(((W - d.textlength(footer, font=f_foot)) / 2, H - 82), footer, font=f_foot, fill=(255, 255, 255))
    pin.save(out, quality=92)

def main():
    import sys
    mode = "venues" if "--venues" in sys.argv else "cities"
    top_n = 15
    data = json.load(open(os.path.join(ROOT, "web", "lib", "data", "venues.json")))
    photos = ["cartoon_balloons_rgb.jpg", "balloons_event_rgb.jpg", "cake_candles.jpg"]
    rows = []

    if mode == "venues":
        top = [v for v in data["venues"] if v.get("website")][:top_n]
        for i, v in enumerate(top):
            headline = v["name"]
            det = (v.get("partyDetails") or "").replace("prices: ", "Packages ").replace("capacity: ", "- up to ")
            if len(det) > 90: det = det[:87] + "..."
            sub = det or " · ".join(v["tags"][:3])
            fname = f"pin-{v['slug']}.png"
            make_pin(os.path.join(PHOTOS, photos[i % len(photos)]), headline, sub,
                     "Toronto Birthday Parties", os.path.join(PINS, fname))
            rating = f" rated {v['rating']} stars" if v.get("rating") else ""
            rows.append({
                "file": fname,
                "title": f"{v['name']} - Kids Birthday Party Venue in {v['city']}",
                "desc": (f"{v['name']} is a kids birthday party venue in {v['city']}, Ontario{rating}. "
                         f"{(v.get('partyDetails') or 'Birthday party packages available.')}. "
                         f"Contact details, packages and more venues on Toronto Birthday Parties."),
                "link": f"https://torontobirthdayparties.com/venues/{v['slug']}",
            })
        print(f"venue mode: top {len(rows)} venues by review count")
    else:
        cities = [{"name": c, "count": len(s)} for c, s in data["cities"].items()]
        cities.sort(key=lambda c: -c["count"])
        total = len(data["venues"])
        for i, c in enumerate(cities):
            slug = c["name"].lower().replace(" ", "-")
            headline = f"{c['count']} Best Kids Party Venues in {c['name']}"
            sub = "Indoor playgrounds · trampoline parks · party packages"
            fname = f"pin-{slug}.png"
            make_pin(os.path.join(PHOTOS, photos[i % len(photos)]), headline, sub,
                     "Toronto Birthday Parties", os.path.join(PINS, fname))
            rows.append({
                "file": fname,
                "title": f"Kids Birthday Party Venues in {c['name']} ({c['count']} Curated)",
                "desc": (f"Looking for birthday party venues in {c['name']}? {c['count']} hand-picked "
                         f"kids party venues with real package pricing — indoor playgrounds, trampoline "
                         f"parks and party spaces. Compare and contact directly."),
                "link": f"https://torontobirthdayparties.com/birthday-party-venues/{slug}",
            })
        make_pin(os.path.join(PHOTOS, "cartoon_balloons_rgb.jpg"),
                 f"{total} Kids Party Venues Across the GTA",
                 "The curated directory — searchable by city",
                 "Toronto Birthday Parties", os.path.join(PINS, "pin-homepage.png"))
        rows.append({
            "file": "pin-homepage.png",
            "title": f"Kids Birthday Party Venues Across the GTA ({total} Curated)",
            "desc": ("A hand-curated directory of kids birthday party venues across Toronto, "
                     "Mississauga, Scarborough, Vaughan and the whole GTA. Every listing verified "
                     "for birthday packages — searchable by city."),
            "link": "https://torontobirthdayparties.com/",
        })

    with open(os.path.join(PINS, "pins.md"), "w") as f:
        f.write("# Pinterest pins — upload sheet\n\n")
        for r in rows:
            f.write(f"## {r['file']}\n- Link: {r['link']}\n- Title: {r['title']}\n- Description: {r['desc']}\n\n")
    print(f"{len(rows)} pins -> {PINS} (+ pins.md)")

if __name__ == "__main__":
    main()
