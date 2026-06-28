const fs = require("node:fs");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const DEFAULT_THUMB = "/assets/images/thumb-placeholder.svg";
const THUMB_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

const CSV_CANDIDATES = [
  path.join(REPO_ROOT, "data", "My_papers.csv"),
  path.join(REPO_ROOT, "My_papers.csv"),
];

// --- People -------------------------------------------------------------
// Match Ricky no matter how Zotero spells the surname (note the "Nathavni"
// typo in one row) or whether the first name is given in full or as "R.".
const RICKY_SURNAMES = new Set(["nathvani", "nathavni"]);
const RICKY_DISPLAY = "Ricky Nathvani";

// Per-paper overrides keyed by the Zotero **Key** column (stable across
// re-exports). Use this for joint-first authorship that the author order
// alone can't express, or to pin a custom slug / thumbnail.
//   firstAuthor: "joint"  -> Ricky gets the asterisk + "Joint first author"
//   firstAuthor: "first"  -> force the lead-author asterisk
//   firstAuthor: false    -> suppress the asterisk
//   slug / thumbnail      -> override the auto-derived values
const MANUAL = {
  X46AX8FZ: { firstAuthor: "joint" }, // Nath et al., Cities (2026) — joint first
};

// --- CSV parsing (same hand-rolled parser as writing.js) ----------------
function findFirstExisting(paths) {
  return paths.find((candidate) => fs.existsSync(candidate));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }
    if (char === "\r") {
      continue;
    }
    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// --- Helpers ------------------------------------------------------------
function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function slugify(value, maxLen = 60) {
  const base = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (base.length <= maxLen) {
    return base;
  }
  const cut = base.slice(0, maxLen);
  const lastDash = cut.lastIndexOf("-");
  return lastDash > 0 ? cut.slice(0, lastDash) : cut;
}

// "Last, First M." -> { last, first, display, isRicky }
function parseAuthor(chunk) {
  const trimmed = chunk.trim();
  let last = trimmed;
  let first = "";
  const comma = trimmed.indexOf(",");
  if (comma !== -1) {
    last = trimmed.slice(0, comma).trim();
    first = trimmed.slice(comma + 1).trim();
  }
  const isRicky = RICKY_SURNAMES.has(last.toLowerCase());
  const display = isRicky
    ? RICKY_DISPLAY
    : [first, last].filter(Boolean).join(" ");
  return { last, first, display, isRicky };
}

function parseAuthors(value) {
  return String(value || "")
    .split(";")
    .map((c) => c.trim())
    .filter(Boolean)
    .map(parseAuthor);
}

function buildAuthorsHtml(authors, rickyHasAsterisk) {
  return authors
    .map((a) => {
      let name = escapeHtml(a.display);
      if (a.isRicky) {
        name = `<strong>${name}</strong>`;
        if (rickyHasAsterisk) {
          name += '<sup class="pub-firstauthor">*</sup>';
        }
      }
      return name;
    })
    .join(", ");
}

function toSortableDate(dateValue, year) {
  const m = String(dateValue || "").match(
    /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/
  );
  if (m) {
    return `${m[1]}-${m[2] || "01"}-${m[3] || "01"}`;
  }
  const y = String(year || "").match(/\d{4}/);
  return y ? `${y[0]}-01-01` : "0000-01-01";
}

function resolveThumbnail(slug, manualThumb) {
  if (manualThumb) {
    return manualThumb;
  }
  for (const ext of THUMB_EXTS) {
    const rel = `publications/${slug}${ext}`;
    if (fs.existsSync(path.join(REPO_ROOT, "src", "assets", rel))) {
      return `/assets/${rel}`;
    }
  }
  return DEFAULT_THUMB;
}

function readWriteup(slug) {
  const file = path.join(
    REPO_ROOT,
    "src",
    "publications",
    "writeups",
    `${slug}.html`
  );
  if (fs.existsSync(file)) {
    return fs.readFileSync(file, "utf8").trim();
  }
  return "";
}

function buildPaperUrl(doi, url) {
  const cleanDoi = String(doi || "").trim();
  if (cleanDoi) {
    return `https://doi.org/${cleanDoi}`;
  }
  return String(url || "").trim();
}

// --- Main load ----------------------------------------------------------
function loadRows(csvPath) {
  if (!csvPath) {
    return [];
  }
  const text = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
  const matrix = parseCsv(text);
  if (!matrix.length) {
    return [];
  }

  const headers = matrix[0].map((h) => String(h || "").trim());
  const records = [];
  for (let i = 1; i < matrix.length; i += 1) {
    const cells = matrix[i];
    if (!cells || !cells.some((c) => String(c || "").trim())) {
      continue;
    }
    const record = {};
    headers.forEach((header, index) => {
      if (header) {
        record[header] = cells[index] ?? "";
      }
    });
    records.push(record);
  }
  return records;
}

function normalize(record) {
  const key = String(record.Key || "").trim();
  const manual = MANUAL[key] || {};

  const title = String(record.Title || "").trim();
  const journal = String(record["Publication Title"] || "").trim();
  const year = String(record["Publication Year"] || "").trim();
  const abstract = String(record["Abstract Note"] || "").trim();
  const authors = parseAuthors(record.Author);

  const slug = manual.slug || slugify(title);

  // First / joint-first authorship.
  let rickyHasAsterisk;
  let firstAuthorLabel = null;
  if (manual.firstAuthor === false) {
    rickyHasAsterisk = false;
  } else if (manual.firstAuthor === "joint") {
    rickyHasAsterisk = true;
    firstAuthorLabel = "Joint first author";
  } else if (manual.firstAuthor === "first") {
    rickyHasAsterisk = true;
    firstAuthorLabel = "First author";
  } else {
    rickyHasAsterisk = authors.length > 0 && authors[0].isRicky;
    firstAuthorLabel = rickyHasAsterisk ? "First author" : null;
  }

  return {
    key,
    slug,
    title,
    journal,
    year,
    sortDate: toSortableDate(record.Date, year),
    abstract,
    authors,
    authorsHtml: buildAuthorsHtml(authors, rickyHasAsterisk),
    rickyFirst: rickyHasAsterisk,
    firstAuthorLabel,
    paperUrl: buildPaperUrl(record.DOI, record.Url),
    doi: String(record.DOI || "").trim(),
    thumbnail: resolveThumbnail(slug, manual.thumbnail),
    writeupHtml: readWriteup(slug),
  };
}

function loadData() {
  const csvPath = findFirstExisting(CSV_CANDIDATES);
  const rows = loadRows(csvPath)
    .map(normalize)
    .filter((p) => p.title);

  rows.sort(
    (a, b) =>
      b.sortDate.localeCompare(a.sortDate) || a.title.localeCompare(b.title)
  );

  const bySlug = {};
  rows.forEach((p) => {
    bySlug[p.slug] = p;
  });

  return {
    csvPath: csvPath ? path.relative(REPO_ROOT, csvPath) : null,
    portfolio: rows, // most recent first
    bySlug,
  };
}

module.exports = loadData();
