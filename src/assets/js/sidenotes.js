(() => {
  const desktopQuery = window.matchMedia("(min-width: 901px)");
  let scheduled = false;

  function getCaptions(page) {
    return Array.from(
      page.querySelectorAll("figure:not(.fullwidth) > figcaption")
    );
  }

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

  function resetCaption(caption) {
    caption.style.top = "";
  }

  function disablePage(page) {
    page.classList.remove("page--sidenotes-enhanced");
    page.style.removeProperty("--margin-column-left");
    page.style.minHeight = "";

    getPairs(page).forEach(({ note }) => {
      resetNote(note);
    });

    getCaptions(page).forEach((caption) => {
      resetCaption(caption);
    });
  }

  function layoutPage(page) {
    const pairs = getPairs(page);
    const captions = getCaptions(page);

    if (!pairs.length) {
      return;
    }

    if (!desktopQuery.matches) {
      disablePage(page);
      return;
    }

    pairs.forEach(({ note }) => {
      resetNote(note);
    });

    captions.forEach((caption) => {
      resetCaption(caption);
    });

    page.classList.remove("page--sidenotes-enhanced");
    page.style.removeProperty("--margin-column-left");
    page.style.minHeight = "";

    const pageRect = page.getBoundingClientRect();
    const pageTop = pageRect.top + window.scrollY;
    const pageHeight = page.scrollHeight;
    const noteGap = Number.parseFloat(
      getComputedStyle(page).getPropertyValue("--sidenote-gap")
    ) || 16;

    if (captions.length) {
      const marginColumnLeft =
        captions[0].getBoundingClientRect().left - pageRect.left;
      page.style.setProperty("--margin-column-left", `${marginColumnLeft}px`);
    }

    const items = [
      ...pairs.map(({ anchor, note }) => ({
        element: note,
        naturalHeight: note.scrollHeight,
        preferredTop:
          anchor.getBoundingClientRect().top + window.scrollY - pageTop,
        priority: 0,
        type: "sidenote",
      })),
      ...captions.map((caption) => ({
        element: caption,
        naturalHeight: caption.offsetHeight,
        preferredTop:
          caption.getBoundingClientRect().top + window.scrollY - pageTop,
        priority: 1,
        type: "caption",
      })),
    ].sort(
      (left, right) =>
        left.preferredTop - right.preferredTop || left.priority - right.priority
    );

    page.classList.add("page--sidenotes-enhanced");

    let cursor = 0;
    let maxBottom = pageHeight;

    items.forEach((item, index) => {
      const top = Math.max(0, Math.max(item.preferredTop, cursor));
      let usedHeight = item.naturalHeight;

      item.element.style.top = `${top}px`;

      if (item.type === "sidenote") {
        const next = items[index + 1];
        const ceiling =
          next && next.preferredTop > top
            ? next.preferredTop - noteGap
            : pageHeight;
        const availableHeight = Math.max(0, ceiling - top);

        if (usedHeight > availableHeight) {
          item.element.style.maxHeight = `${availableHeight}px`;
          item.element.classList.add("sidenote--scrollable");
          usedHeight = availableHeight;
        }
      }

      cursor = top + usedHeight + noteGap;
      maxBottom = Math.max(maxBottom, top + usedHeight);
    });

    page.style.minHeight = `${Math.max(pageHeight, maxBottom)}px`;
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
