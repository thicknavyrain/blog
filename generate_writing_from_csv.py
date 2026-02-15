#!/usr/bin/env python3
import argparse
import csv
import html
from datetime import datetime
from pathlib import Path


def format_views_nearest_1000(value: str) -> str:
    try:
        n = int(str(value).replace(",", "").strip())
    except Exception:
        return "0 views"
    rounded = int(round(n / 1000.0) * 1000)
    return f"{rounded:,} views"


def parse_date(date_str: str):
    try:
        return datetime.strptime((date_str or "").strip(), "%Y-%m-%d")
    except Exception:
        return datetime(1900, 1, 1)


def load_csv_rows(csv_path: Path):
    text = csv_path.read_text(encoding="utf-8-sig", errors="ignore")
    sample = text[:2048]
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=[",", "\t", ";"])
    except csv.Error:
        dialect = csv.excel

    reader = csv.DictReader(text.splitlines(), dialect=dialect)
    required = {"Upload Date", "Channel", "Title", "Views", "Video URL", "Thumbnail Path"}
    missing = required - set(reader.fieldnames or [])
    if missing:
        raise ValueError(f"CSV missing required columns: {sorted(missing)}")

    rows = list(reader)
    rows.sort(key=lambda r: parse_date(r.get("Upload Date", "")), reverse=True)
    return rows


def make_tile(row: dict, asset_prefix: str):
    title_raw = (row.get("Title") or "").strip()
    channel_raw = (row.get("Channel") or "").strip()
    views_raw = row.get("Views", "0")
    url_raw = (row.get("Video URL") or "").strip()
    thumb_raw = (row.get("Thumbnail Path") or "").strip().replace("\\", "/").lstrip("/")

    title = html.escape(title_raw)
    channel = html.escape(channel_raw)
    views = format_views_nearest_1000(views_raw)
    url = html.escape(url_raw, quote=True)
    thumb_src = html.escape(f"{asset_prefix.rstrip('/')}/{thumb_raw}", quote=True)
    alt = html.escape(f"Thumbnail for {title_raw}")

    tile_html = f"""          <div class=\"gallery-tile\">\n            <a class=\"tile-image\" href=\"{url}\" target=\"_blank\" rel=\"noreferrer\">\n              <img class=\"tile-thumb\" src=\"{thumb_src}\" alt=\"{alt}\" />\n              <span>Video</span>\n              <strong>{title}</strong>\n            </a>\n            <div class=\"caption\">\n              <p>{channel}<br>{views}</p>\n              <details>\n                <summary>More</summary>\n                <p></p>\n              </details>\n            </div>\n          </div>"""
    return tile_html, thumb_raw


def find_matching_div_end(s: str, div_open_start: int) -> int:
    i = div_open_start
    depth = 0
    while i < len(s):
        next_open = s.find("<div", i)
        next_close = s.find("</div>", i)

        if next_close == -1:
            raise ValueError("Unbalanced divs: no closing </div> found.")

        if next_open != -1 and next_open < next_close:
            depth += 1
            i = next_open + 4
        else:
            depth -= 1
            i = next_close + len("</div>")
            if depth == 0:
                return i

    raise ValueError("Unbalanced div structure while scanning grid block.")


def replace_writing_grid(html_text: str, new_tiles_block: str) -> str:
    anchor = "<h2>Writing Portfolio</h2>"
    anchor_idx = html_text.find(anchor)
    if anchor_idx == -1:
        raise ValueError("Could not find Writing Portfolio heading.")

    grid_open = html_text.find('<div class="grid">', anchor_idx)
    if grid_open == -1:
        raise ValueError("Could not find grid block after Writing Portfolio heading.")

    grid_close_end = find_matching_div_end(html_text, grid_open)
    replacement = '<div class="grid">\n' + new_tiles_block + "\n        </div>"

    return html_text[:grid_open] + replacement + html_text[grid_close_end:]


def verify_thumbnails(rows, thumbnails_root: Path):
    missing = []
    for r in rows:
        rel = (r.get("Thumbnail Path") or "").strip().replace("\\", "/").lstrip("/")
        if not (thumbnails_root / rel).exists():
            missing.append(rel)
    return missing


def main():
    parser = argparse.ArgumentParser(description="Populate src/writing.html tiles from CSV")
    parser.add_argument("--csv", default="video_data.csv", help="Path to CSV file")
    parser.add_argument("--writing", default="src/writing.html", help="Path to writing.html")
    parser.add_argument("--asset-prefix", default="/assets", help="URL prefix for thumbnail paths")
    parser.add_argument("--verify-root", default="src/assets", help="Filesystem root for thumbnail existence checks")
    parser.add_argument("--backup", action="store_true", help="Write a .bak copy before replacing")
    parser.add_argument("--no-verify", action="store_true", help="Skip thumbnail file existence checks")
    args = parser.parse_args()

    csv_path = Path(args.csv)
    writing_path = Path(args.writing)
    verify_root = Path(args.verify_root)

    if not csv_path.exists():
        raise SystemExit(f"CSV not found: {csv_path}")
    if not writing_path.exists():
        raise SystemExit(f"writing.html not found: {writing_path}")

    rows = load_csv_rows(csv_path)

    if not args.no_verify:
        missing = verify_thumbnails(rows, verify_root)
        if missing:
            print("WARNING: Missing thumbnail files:")
            for m in missing:
                print(f"  - {verify_root / m}")
            print("Continuing anyway...")

    tiles = []
    for r in rows:
        tile, _ = make_tile(r, args.asset_prefix)
        tiles.append(tile)
    new_tiles_block = "\n".join(tiles)

    original = writing_path.read_text(encoding="utf-8")
    updated = replace_writing_grid(original, new_tiles_block)

    if args.backup:
        writing_path.with_suffix(writing_path.suffix + ".bak").write_text(original, encoding="utf-8")

    writing_path.write_text(updated, encoding="utf-8")
    print(f"Updated {writing_path} with {len(rows)} tiles.")


if __name__ == "__main__":
    main()
