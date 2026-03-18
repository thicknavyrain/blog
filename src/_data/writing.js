const fs = require("node:fs");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const DEFAULT_THUMB = "/assets/images/thumb-placeholder.svg";

const CSV_CANDIDATES = [
  path.join(REPO_ROOT, "data", "video_data.csv"),
  path.join(REPO_ROOT, "video_data.csv"),
];

const HIGHLIGHT_CANDIDATES = [
  path.join(REPO_ROOT, "data", "highlight_reel_rows.txt"),
  path.join(REPO_ROOT, "highlight_reel_rows.txt"),
];

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

function parseIntOrZero(value) {
  const cleaned = String(value || "")
    .replace(/,/g, "")
    .trim();
  const parsed = Number.parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseUploadDate(value) {
  const uploadDate = String(value || "").trim();
  if (!uploadDate) {
    return { uploadDate: "", uploadTimestamp: 0 };
  }

  const timestamp = Date.parse(`${uploadDate}T00:00:00Z`);
  if (Number.isNaN(timestamp)) {
    return { uploadDate, uploadTimestamp: 0 };
  }

  return { uploadDate, uploadTimestamp: timestamp };
}

function formatViewsNearestThousand(views) {
  const rounded = Math.round(views / 1000) * 1000;
  return `${rounded.toLocaleString("en-US")} views`;
}

function normalizeThumbnailPath(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return DEFAULT_THUMB;
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  const normalized = raw.replace(/\\/g, "/").replace(/^\.?\//, "");

  let assetRelative = normalized;

  if (assetRelative.startsWith("src/assets/")) {
    assetRelative = assetRelative.slice("src/assets/".length);
  } else if (assetRelative.startsWith("assets/")) {
    assetRelative = assetRelative.slice("assets/".length);
  } else if (!assetRelative.includes("/")) {
    assetRelative = `thumbnails/${assetRelative}`;
  }

  const candidatePath = path.join(REPO_ROOT, "src", "assets", assetRelative);
  if (fs.existsSync(candidatePath)) {
    return `/assets/${assetRelative}`;
  }

  // If CSV has exporter-style suffixes (e.g. -1, -2), try the base filename.
  const fallbackRelative = assetRelative.replace(/-\d+(?=\.[^.]+$)/, "");
  if (fallbackRelative !== assetRelative) {
    const fallbackPath = path.join(REPO_ROOT, "src", "assets", fallbackRelative);
    if (fs.existsSync(fallbackPath)) {
      return `/assets/${fallbackRelative}`;
    }
  }

  return DEFAULT_THUMB;
}

function normalizeRow(rawRow, rowNumber) {
  const title = String(rawRow.Title || "").trim();
  const channel = String(rawRow.Channel || "").trim();
  const url = String(rawRow["Video URL"] || "").trim();
  const description = String(rawRow.Description || "").trim();
  const views = parseIntOrZero(rawRow.Views);
  const { uploadDate, uploadTimestamp } = parseUploadDate(rawRow["Upload Date"]);

  return {
    rowNumber,
    title,
    channel,
    url,
    description,
    views,
    viewsLabel: formatViewsNearestThousand(views),
    uploadDate,
    uploadTimestamp,
    thumbnail: normalizeThumbnailPath(rawRow["Thumbnail Path"]),
  };
}

function loadRows(csvPath) {
  if (!csvPath) {
    return [];
  }

  const text = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
  const matrix = parseCsv(text);
  if (!matrix.length) {
    return [];
  }

  const headers = matrix[0].map((entry) => String(entry || "").trim());
  const rows = [];

  for (let i = 1; i < matrix.length; i += 1) {
    const cells = matrix[i];
    if (!cells || !cells.some((entry) => String(entry || "").trim())) {
      continue;
    }

    const record = {};
    headers.forEach((header, index) => {
      if (!header) {
        return;
      }
      record[header] = cells[index] ?? "";
    });

    const normalized = normalizeRow(record, i);
    if (!normalized.title || !normalized.url) {
      continue;
    }
    rows.push(normalized);
  }

  return rows;
}

function parseHighlightRows(selectionText) {
  const selected = [];
  const seen = new Set();
  const lines = selectionText.split(/\r?\n/);

  lines.forEach((line) => {
    const commentStripped = line.split("#")[0].trim();
    if (!commentStripped) {
      return;
    }

    commentStripped
      .split(/[,\s]+/)
      .filter(Boolean)
      .forEach((token) => {
        const value = Number.parseInt(token, 10);
        if (!Number.isInteger(value) || value <= 0 || seen.has(value)) {
          return;
        }
        seen.add(value);
        selected.push(value);
      });
  });

  return selected;
}

function sortByViews(a, b) {
  return (
    b.views - a.views ||
    b.uploadTimestamp - a.uploadTimestamp ||
    a.rowNumber - b.rowNumber
  );
}

function loadData() {
  const csvPath = findFirstExisting(CSV_CANDIDATES);
  const selectionPath = findFirstExisting(HIGHLIGHT_CANDIDATES);
  const rows = loadRows(csvPath);

  const selectedRowNumbers = selectionPath
    ? parseHighlightRows(fs.readFileSync(selectionPath, "utf8"))
    : [];

  const rowMap = new Map(rows.map((item) => [item.rowNumber, item]));
  const highlightReel = selectedRowNumbers
    .map((rowNumber) => rowMap.get(rowNumber))
    .filter(Boolean);

  return {
    csvPath: csvPath ? path.relative(REPO_ROOT, csvPath) : null,
    highlightSelectionPath: selectionPath
      ? path.relative(REPO_ROOT, selectionPath)
      : null,
    highlightReel,
    portfolio: [...rows].sort(sortByViews),
  };
}

module.exports = loadData();
