(() => {
  const grid = document.querySelector("[data-writing-grid]");
  const buttons = Array.from(document.querySelectorAll("[data-writing-sort]"));

  if (!grid || !buttons.length) {
    return;
  }

  const parseViews = (tile) => Number.parseInt(tile.dataset.views || "0", 10) || 0;
  const parseRowNumber = (tile) => Number.parseInt(tile.dataset.rowNumber || "0", 10) || 0;
  const parseUploadTimestamp = (tile) => {
    const value = tile.dataset.uploadDate || "";
    const timestamp = Date.parse(`${value}T00:00:00Z`);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  const comparators = {
    views: (a, b) =>
      parseViews(b) - parseViews(a) ||
      parseUploadTimestamp(b) - parseUploadTimestamp(a) ||
      parseRowNumber(a) - parseRowNumber(b),
    recent: (a, b) =>
      parseUploadTimestamp(b) - parseUploadTimestamp(a) ||
      parseViews(b) - parseViews(a) ||
      parseRowNumber(a) - parseRowNumber(b),
  };

  const sortTiles = (mode) => {
    const comparator = comparators[mode] || comparators.views;
    const tiles = Array.from(grid.querySelectorAll(".gallery-tile"));
    tiles.sort(comparator).forEach((tile) => grid.appendChild(tile));

    buttons.forEach((button) => {
      const isActive = button.dataset.writingSort === mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      sortTiles(button.dataset.writingSort);
    });
  });

  sortTiles("views");
})();
