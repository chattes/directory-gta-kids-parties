#!/usr/bin/env python3
"""Generate birthday-wishes / card-idea Pinterest pins (1000x1500).

Usage: python3 scripts/make_wish_pins.py [--all]
Without flags renders only the 3 sample designs (samples/ dir) for approval.
With --all renders the full batch to assets/pins/wishes/ and writes the
upload CSV rows to assets/pins/wishes.csv (drip-scheduled).
"""
import json, os, random, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "assets", "pins", "wishes")
SAMPLES_DIR = os.path.join(OUT, "samples")
PHOTOS = os.path.join(ROOT, "assets", "pins", "photos")

INK = (34, 23, 75)        # brand purple
CREAM = (255, 244, 220)
SUN = (255, 197, 49)
CORAL = (255, 92, 77)
SKY = (76, 181, 245)
MINT = (51, 201, 163)
PINK = (255, 143, 199)
LILAC = (185, 166, 255)
WHITE = (255, 255, 255)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

W, H = 1000, 1500

PALETTES = [
    {"bg": CREAM, "text": INK, "acc": CORAL, "acc2": SUN},
    {"bg": (240, 248, 255), "text": INK, "acc": SKY, "acc2": MINT},
    {"bg": (255, 240, 246), "text": INK, "acc": PINK, "acc2": LILAC},
    {"bg": (245, 255, 250), "text": INK, "acc": MINT, "acc2": SUN},
]

def font(path, size):
    return ImageFont.truetype(path, size)

def wrap(text, fnt, max_w, draw):
    words, lines, cur = text.split(), [], ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            lines.append(cur); cur = w_
    if cur:
        lines.append(cur)
    return lines

def center(d, y, line, fnt, fill):
    d.text(((W - d.textlength(line, font=fnt)) / 2, y), line, font=fnt, fill=fill)

def balloons(d, cx, cy, colors, r=46, n=3, spread=95):
    for i in range(n):
        x = cx + (i - (n - 1) / 2) * spread
        y = cy + (18 if i % 2 else -12)
        c = colors[i % len(colors)]
        d.ellipse([x - r, y - r, x + r, y + r], fill=c)
        d.polygon([(x - 7, y + r - 4), (x + 7, y + r - 4), (x, y + r + 10)], fill=c)
        d.line([(x, y + r + 10), (x - 8, y + r + 90)], fill=(120, 110, 140), width=3)

def confetti(d, colors, n=60, seed=7):
    rnd = random.Random(seed)
    for _ in range(n):
        x, y = rnd.randint(30, W - 30), rnd.randint(30, H - 140)
        c = rnd.choice(colors)
        if rnd.random() < 0.5:
            d.rectangle([x, y, x + 10, y + 16], fill=c)
        else:
            d.ellipse([x, y, x + 10, y + 10], fill=c)

def footer(d, text="Toronto Birthday Parties", bg=CORAL):
    d.rectangle([0, H - 110, W, H], fill=bg)
    f = font(FONT_BOLD, 40)
    center(d, H - 82, text, f, WHITE)

def cake(d, cx, cy, scale, body, icing):
    # plate
    d.ellipse([cx - 170*scale, cy + 88*scale, cx + 170*scale, cy + 116*scale], fill=(210, 205, 230))
    # bottom tier
    d.rectangle([cx - 130*scale, cy, cx + 130*scale, cy + 92*scale], fill=body)
    d.rectangle([cx - 130*scale, cy, cx + 130*scale, cy + 26*scale], fill=icing)
    # top tier
    d.rectangle([cx - 82*scale, cy - 64*scale, cx + 82*scale, cy], fill=body)
    d.rectangle([cx - 82*scale, cy - 64*scale, cx + 82*scale, cy - 42*scale], fill=icing)
    # candles on top tier
    for i in (-48, 0, 48):
        d.line([(cx + i*scale, cy - 100*scale), (cx + i*scale, cy - 64*scale)], fill=INK, width=6)
        d.ellipse([cx + i*scale - 11, cy - 128*scale, cx + i*scale + 11, cy - 100*scale], fill=SUN)

# ---- templates ----

def template_balloons(wish, sub, pal, out):
    """Big centered wish + balloon cluster + confetti."""
    img = Image.new("RGB", (W, H), pal["bg"])
    d = ImageDraw.Draw(img)
    confetti(d, [pal["acc"], pal["acc2"], SUN, SKY, PINK], n=70)
    balloons(d, W // 2, 300, [pal["acc"], pal["acc2"], CORAL], r=70, n=3, spread=150)
    f_wish = font(FONT_BOLD, 72)
    y = 620
    for line in wrap(wish, f_wish, W - 160, d):
        center(d, y, line, f_wish, pal["text"]); y += 90
    f_sub = font(FONT_REG, 40)
    y += 30
    for line in wrap(sub, f_sub, W - 220, d):
        center(d, y, line, f_sub, (90, 80, 120)); y += 54
    footer(d, bg=pal["acc"])
    img.save(out, quality=92)

def template_card(wish, sub, pal, out):
    """Looks like a folded greeting card: white panel, double border, cake."""
    img = Image.new("RGB", (W, H), pal["bg"])
    d = ImageDraw.Draw(img)
    confetti(d, [pal["acc"], pal["acc2"]], n=40)
    d.rounded_rectangle([70, 260, W - 70, H - 260], radius=36, fill=WHITE, outline=pal["acc"], width=8)
    d.rounded_rectangle([95, 255, W - 95, H - 285], radius=28, outline=pal["acc2"], width=4)
    cake(d, W // 2, 500, 1.25, pal["acc2"], WHITE)
    f_wish = font(FONT_BOLD, 62)
    y = 800
    for line in wrap(wish, f_wish, W - 280, d):
        center(d, y, line, f_wish, pal["text"]); y += 80
    f_sub = font(FONT_REG, 38)
    y += 22
    for line in wrap(sub, f_sub, W - 280, d):
        center(d, y, line, f_sub, (90, 80, 120)); y += 52
    footer(d, bg=pal["acc"])
    img.save(out, quality=92)

def template_photo(wish, sub, pal, out, photo):
    """Photo header (Pexels) + wish below — matches the venue-pin style."""
    from make_pins import cover_crop  # reuse crop helper
    img = Image.new("RGB", (W, H), pal["bg"])
    ph = Image.open(photo).convert("RGB")
    img.paste(cover_crop(ph, W, 700), (0, 0))
    d = ImageDraw.Draw(img)
    f_wish = font(FONT_BOLD, 70)
    y = 810
    for line in wrap(wish, f_wish, W - 160, d):
        center(d, y, line, f_wish, pal["text"]); y += 88
    f_sub = font(FONT_REG, 40)
    y += 26
    for line in wrap(sub, f_sub, W - 220, d):
        center(d, y, line, f_sub, (90, 80, 120)); y += 54
    footer(d, bg=pal["acc"])
    img.save(out, quality=92)

SAMPLE_PINS = [
    ("balloons", "Happy Birthday, Superstar!", "Keep shining brighter every single year."),
    ("card", "Wishing you cake, giggles and extra sprinkles!", "A birthday message every kid will love."),
    ("photo", "Hip hip hooray — it's your special day!", "Birthday wishes for kids, written for real cards."),
]

# ---------------------------------------------------------------------------
# Full batch (20 pins): 14 copy-able wishes + 6 card-idea pins.
# Generated with: python3 scripts/make_wish_pins.py --all
# ---------------------------------------------------------------------------

BOARD = "Kids Birthday Wishes & Card Ideas"
START = "2026-12-06T14:00:00"  # first slot after batch 3 drip ends (Dec 4, 2026); 14:00 UTC = 10am Toronto
DRIP_DAYS = 2

CTAS = [
    "Planning the party too? Browse 92 hand-curated, verified kids party venues across the GTA — searchable by city.",
    "Then plan the party — 92 verified birthday party venues across the GTA, from indoor playgrounds to trampoline parks.",
    "Saving this for the card? Save a venue shortlist too — 92 verified kids party venues across the GTA.",
]

WISHES = [
    ("Happy Birthday, Superstar!", "Keep shining brighter every single year."),
    ("Wishing you cake, giggles and extra sprinkles!", "A birthday message every kid will love."),
    ("Hip hip hooray — it's your special day!", "Birthday wishes for kids, written for real cards."),
    ("Another year bolder, brighter and more wonderful.", "Short and sweet — copy it straight into the card."),
    ("May your day be as sweet as the frosting on your cake.", "A birthday wish for the kid with a sweet tooth."),
    ("Blow out the candles and make it a good one.", "You deserve every wish coming true this year."),
    ("The world got more awesome today — it's your birthday!", "A feel-good message for a kid's birthday card."),
    ("You're not getting older, you're leveling up!", "Happy Birthday, champion. High score unlocked."),
    ("A mountain of presents and a river of cake.", "That's the birthday we're wishing you this year."),
    ("Eat the extra slice — it's the birthday rule.", "Wishes don't get more official than this."),
    ("Happy Birthday to the coolest kid in the whole wide world.", "Straight to the point, straight from the heart."),
    ("Adventure, laughter and stories that never end.", "May your whole year feel this good."),
    ("The biggest birthday hug and the gooiest slice of cake.", "Sent your way with love today."),
    ("Grow big, dream bigger.", "Happy Birthday, little legend."),
]

CARD_IDEAS = [
    ("What to write in a kid's birthday card", "5 message ideas that actually land — save this list.", "birthday card messages, what to write in a kids birthday card"),
    ("7 short birthday wishes kids love", "Quick one-liners for when the card is small but the love is big.", "short birthday wishes, birthday wishes for kids"),
    ("DIY card idea: the confetti pocket", "Tape a folded tissue-paper pocket inside the card, fill with confetti. Instant favourite.", "DIY birthday card, kids birthday card ideas"),
    ("Birthday card idea for a dinosaur-obsessed kid", "Stamp a dino footprint trail across the card with paint. Rawr means happy birthday.", "dinosaur birthday card, DIY kids card"),
    ("The fill-in-the-blank birthday card", "You are __ years of awesome. Your superpower is __. Today we celebrate __!", "funny birthday card ideas, printable birthday card"),
    ("How to write a first birthday card", "They can't read it yet — write it for the parents. One memory, one wish, one prediction.", "first birthday wishes, 1st birthday card message"),
]

PHOTO_MAP = [
    "assets/pins/photos/cake_candles.jpg",
    "assets/pins/photos/balloons_event_rgb.jpg",
    "assets/pins/photos/cartoon_balloons_rgb.jpg",
    "assets/pins/photos/balloons_pile_rgb.jpg",
]


def pin_rows():
    """Assign templates, palettes, links, and build CSV row dicts."""
    city_links = [
        "https://torontobirthdayparties.com/birthday-party-venues/toronto",
        "https://torontobirthdayparties.com/birthday-party-venues/mississauga",
        "https://torontobirthdayparties.com/birthday-party-venues/scarborough",
        "https://torontobirthdayparties.com/birthday-party-venues/vaughan",
        "https://torontobirthdayparties.com/birthday-party-venues/brampton",
        "https://torontobirthdayparties.com/birthday-party-venues/markham",
        "https://torontobirthdayparties.com/birthday-party-venues/whitby",
    ]
    rows = []
    city_i = 0
    for i, (wish, sub) in enumerate(WISHES):
        tpl = ["balloons", "card", "photo"][i % 3]
        link = "https://torontobirthdayparties.com/" if i % 3 == 0 else city_links[city_i % len(city_links)]
        if i % 3 != 0:
            city_i += 1
        rows.append({
            "template": tpl, "wish": wish, "sub": sub,
            "title": f"Birthday Wishes for Kids: {wish}"[:95],
            "desc": f'"{wish} {sub}" — save this birthday wish for your kid\'s card. {CTAS[i % len(CTAS)]}',
            "link": link,
            "keywords": "birthday wishes for kids, birthday message for kids, kids birthday card, Toronto birthday parties",
        })
    for i, (headline, sub, kw) in enumerate(CARD_IDEAS):
        rows.append({
            "template": "card" if i % 2 == 0 else "balloons",
            "wish": headline, "sub": sub,
            "title": headline[:95],
            "desc": f"{headline} — {sub} {CTAS[(i + 1) % len(CTAS)]}",
            "link": "https://torontobirthdayparties.com/",
            "keywords": f"{kw}, Toronto birthday parties",
        })
    return rows


def render(row, idx, out_dir):
    pal = PALETTES[idx % len(PALETTES)]
    fname = f"wish-{idx + 1:02d}.png"
    out = os.path.join(out_dir, fname)
    if row["template"] == "balloons":
        template_balloons(row["wish"], row["sub"], pal, out)
    elif row["template"] == "card":
        template_card(row["wish"], row["sub"], pal, out)
    else:
        photo = os.path.join(ROOT, PHOTO_MAP[idx % len(PHOTO_MAP)])
        template_photo(row["wish"], row["sub"], pal, out, photo)
    return fname


def upload(path):
    import subprocess
    url = subprocess.run(
        ["curl", "-s", "-F", "reqtype=fileupload", "-F", f"fileToUpload=@{path}",
         "https://catbox.moe/user/api.php"], capture_output=True, text=True).stdout.strip()
    if not url.startswith("http"):
        raise SystemExit(f"catbox upload failed for {path}: {url}")
    return url


def write_csv(rows, fname_to_url, path):
    import csv
    from datetime import datetime, timedelta
    t = datetime.fromisoformat(START)
    with open(path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["Title", "Media URL", "Pinterest board", "Thumbnail", "Description", "Link", "Publish date", "Keywords"])
        for i, r in enumerate(rows):
            w.writerow([r["title"], fname_to_url[r["file"]], BOARD, "", r["desc"], r["link"],
                        t.strftime("%Y-%m-%dT%H:%M:%S"), r["keywords"]])
            t += timedelta(days=DRIP_DAYS)


def main():
    import sys, csv
    if "--all" not in sys.argv:
        os.makedirs(SAMPLES_DIR, exist_ok=True)
        for i, (tpl, wish, sub) in enumerate(SAMPLE_PINS):
            pal = PALETTES[i % len(PALETTES)]
            out = os.path.join(SAMPLES_DIR, f"sample-{tpl}.png")
            if tpl == "balloons":
                template_balloons(wish, sub, pal, out)
            elif tpl == "card":
                template_card(wish, sub, pal, out)
            else:
                template_photo(wish, sub, pal, out, os.path.join(PHOTOS, "cartoon_balloons_rgb.jpg"))
            print("wrote", out)
        return

    rows = pin_rows()
    os.makedirs(OUT, exist_ok=True)
    fname_to_url = {}
    for i, r in enumerate(rows):
        r["file"] = render(r, i, OUT)
        fname_to_url[r["file"]] = upload(os.path.join(OUT, r["file"]))
        print(f'{i + 1}/{len(rows)} {r["file"]} -> {fname_to_url[r["file"]]}')

    # manifest so the CSV can be rebuilt without re-uploading
    with open(os.path.join(OUT, "uploaded_urls.json"), "w") as f:
        json.dump({r["file"]: fname_to_url[r["file"]] for r in rows}, f, indent=1)

    csv_path = os.path.join(OUT, "pinterest_wishes_batch4.csv")
    write_csv(rows, fname_to_url, csv_path)
    print(f"\nwrote {csv_path} — {len(rows)} pins, board '{BOARD}', drip every {DRIP_DAYS} days from {START}")


if __name__ == "__main__":
    main()
