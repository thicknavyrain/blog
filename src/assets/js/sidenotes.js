(() => {
  const desktopQuery = window.matchMedia("(min-width: 901px)");
  let scheduled = false;

  function getPairs(page) {
    return Array.from(page.querySelectorAll(".sidenote[data-sidenote-id]"))
      .map((note) => {
        const anchorId = note.dataset.sidenoteId;
        const anchor = page.querySelector(
          `.sidenote-anchor[data-sidenote-anchor="${anchorId}"]`
        );

        if (!anchor) {
          return null;
        }

        return { anchor, note };
      })
      .filter(Boolean);
  }

  function resetNote(note) {
    note.style.top = "";
    note.style.maxHeight = "";
    note.classList.remove("sidenote--scrollable");
  }

  function disablePage(page) {
    page.classList.remove("page--sidenotes-enhanced");

    getPairs(page).forEach(({ note }) => {
      resetNote(note);
    });
  }

  function layoutPage(page) {
    const pairs = getPairs(page);

    if (!pairs.length) {
      return;
    }

    if (!desktopQuery.matches) {
      disablePage(page);
      return;
    }

    page.classList.add("page--sidenotes-enhanced");

    pairs.forEach(({ note }) => {
      resetNote(note);
    });

    const pageTop = page.getBoundingClientRect().top + window.scrollY;
    const pageHeight = page.offsetHeight;
    const noteGap = Number.parseFloat(
      getComputedStyle(page).getPropertyValue("--sidenote-gap")
    ) || 16;

    const measurements = pairs.map(({ anchor, note }) => ({
      note,
      top: anchor.getBoundingClientRect().top + window.scrollY - pageTop,
      naturalHeight: note.scrollHeight,
    }));

    measurements.forEach((current, index) => {
      const next = measurements[index + 1];
      const ceiling = next ? next.top - noteGap : pageHeight;
      const availableHeight = Math.max(0, ceiling - current.top);

      current.note.style.top = `${Math.max(0, current.top)}px`;

      if (current.naturalHeight > availableHeight) {
        current.note.style.maxHeight = `${availableHeight}px`;
        current.note.classList.add("sidenote--scrollable");
      }
    });
  }

  function layoutAllPages() {
    scheduled = false;
    document.querySelectorAll(".page").forEach((page) => {
      layoutPage(page);
    });
  }

  function scheduleLayout() {
    if (scheduled) {
      return;
    }

    scheduled = true;
    window.requestAnimationFrame(layoutAllPages);
  }

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", scheduleLayout);
  } else {
    desktopQuery.addListener(scheduleLayout);
  }

  document.addEventListener("DOMContentLoaded", scheduleLayout);
  window.addEventListener("load", scheduleLayout);
  window.addEventListener("resize", scheduleLayout);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleLayout).catch(() => {});
  }
})();
