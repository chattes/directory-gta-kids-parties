#!/usr/bin/env python3
"""One-command Pinterest pack: generate pins, host them, build the upload CSV.

Usage (from repo root):
  python3 scripts/publish_pins.py                          # city pins, default board + schedule
  python3 scripts/publish_pins.py "Board Name" 2026-09-12  # custom board, start date

Steps: runs make_pins.py -> uploads pin-*.png to a public file host ->
writes assets/pins/PIN-UPLOAD.csv with staggered publish dates (one pin
every 2 days, starting at 14:00 UTC of the start date). Then upload
PIN-UPLOAD.csv via Pinterest -> Settings -> Import content.
"""
import csv, os, re, subprocess, sys
from datetime import datetime, timedelta

ROOT = os.path.join(os.path.dirname(__file__), "..")
PINS = os.path.join(ROOT, "assets", "pins")
BOARD_DEFAULT = "Kids Birthday Party Venues - GTA"

def upload(path):
    out = subprocess.run(
        ["curl", "-s", "-F", "reqtype=fileupload", "-F", f"fileToUpload=@{path}",
         "https://catbox.moe/user/api.php"], capture_output=True, text=True).stdout.strip()
    if not out.startswith("http"):
        sys.exit(f"upload failed for {path}: {out}")
    return out

def main():
    board = sys.argv[1] if len(sys.argv) > 1 else BOARD_DEFAULT
    start = datetime.strptime(sys.argv[2], "%Y-%m-%d") if len(sys.argv) > 2 else datetime.now() + timedelta(days=1)
    start = start.replace(hour=14, minute=0)  # 14:00 UTC = 10am Toronto

    subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "make_pins.py")], check=True)

    md = open(os.path.join(PINS, "pins.md")).read()
    rows = []
    for i, b in enumerate(md.split("## ")[1:]):
        fname = b.split("\n")[0].strip()
        link = re.search(r"Link: (\S+)", b).group(1)
        title = re.search(r"Title: (.+)", b).group(1).strip()
        desc = re.search(r"Description: (.+)", b).group(1).strip()
        desc = (desc.replace("—", "-").replace("·", ",").replace("’", "'"))
        city = re.sub(r"pin-|\.png", "", fname)
        url = upload(os.path.join(PINS, fname))
        rows.append({
            "Title": title, "Media URL": url, "Pinterest board": board, "Thumbnail": "",
            "Description": desc, "Link": link,
            "Publish date": (start + timedelta(days=2 * i)).strftime("%Y-%m-%dT%H:%M:%S"),
            "Keywords": "birthday party venues, kids party, Toronto, GTA, " + city.replace("-", " "),
        })

    out = os.path.join(PINS, "PIN-UPLOAD.csv")
    with open(out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()), lineterminator="\n")
        w.writeheader(); w.writerows(rows)
    print(f"\n{len(rows)} pins uploaded + scheduled {rows[0]['Publish date']} -> {rows[-1]['Publish date']}")
    print(f"Upload this file to Pinterest (Settings -> Import content):\n  {out}")

if __name__ == "__main__":
    main()
