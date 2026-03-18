# blog

## Source of truth

- Edit source files in `src/`.
- Generated output is in `_site/` and should not be edited directly.

## Content editing workflow

- About page: edit `src/about.md`.
- Blog posts: create files from `src/posts/_template.md` (or edit `src/posts/*.md`).
- Writing page: edit the CSV + selector files described below.

## Writing page data files

- CSV source: `data/video_data.csv` (preferred location).
- Highlight reel selector: `data/highlight_reel_rows.txt`.

If `data/video_data.csv` does not exist, the site also falls back to `video_data.csv` at repo root for compatibility.

### CSV columns

Required:

- `Upload Date`
- `Channel`
- `Title`
- `Views`
- `Video URL`
- `Thumbnail Path`

Optional:

- `Description` (used in each tile's "More" panel)

### Thumbnail paths

Use one of these in `Thumbnail Path`:

- `thumbnails/2026-01-27.jpg` (recommended)
- `assets/thumbnails/2026-01-27.jpg`
- `/assets/thumbnails/2026-01-27.jpg`

All variants above resolve to files under `src/assets/thumbnails/`.

### Highlight reel curation

`data/highlight_reel_rows.txt` expects one-based row numbers from the CSV (excluding the header), for example:

```txt
1
4
9
```

Those selected rows populate the `Highlight Reel`. The full portfolio uses all rows.

## Writing sort toggle

On `/writing/`, the full portfolio defaults to `Most viewed` and can be switched to `Most recent` with the page toggle.
