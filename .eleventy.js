const path = require("path");

const TEMPLATE_POST_FILES = new Set([
  "_template.md",
  "post-template-1.md",
  "post-template-2.md",
]);

const POST_ORDER = [
  "ogler_shibuya",
  "feringa_nobel",
  "particle_pyramics",
  "nothing_2",
  "nothing_1",
  "particles_politics",
  "four_leafed_particles",
  "proton_spin",
  "dark_matter",
];

function stripMarkup(content) {
  return String(content || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\{%\s*sidenote[\s\S]*?%\}/g, " ")
    .replace(/\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/[`*_>#~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getReadTime(content, wordsPerMinute = 240) {
  const text = stripMarkup(content);

  if (!text) {
    return "1 min read";
  }

  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

function formatPostDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(date)
    .replace(",", "");
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("sidenote", function (content) {
    const page = this.page || {};
    page.sidenoteCounter = (page.sidenoteCounter || 0) + 1;
    const number = page.sidenoteCounter;
    const source = page.inputPath || page.url || "page";
    const sourceSlug = path
      .basename(source, path.extname(source))
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .toLowerCase();
    const id = `${sourceSlug}-sn-${number}`;

    return `
      <span class="sidenote-anchor sidenote-number" data-sidenote-anchor="${id}">${number}</span>
      <label class="margin-toggle sidenote-number" for="${id}">${number}</label>
      <input class="margin-toggle" type="checkbox" id="${id}" />
      <span class="sidenote" data-sidenote-id="${id}"><span class="sidenote-number">${number}</span>${content}</span>
    `;
  });

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addWatchTarget("data/video_data.csv");
  eleventyConfig.addWatchTarget("video_data.csv");
  eleventyConfig.addWatchTarget("data/highlight_reel_rows.txt");
  eleventyConfig.addWatchTarget("highlight_reel_rows.txt");
  eleventyConfig.addWatchTarget("data/My_papers.csv");
  eleventyConfig.addWatchTarget("My_papers.csv");
  eleventyConfig.addFilter("formatPostDate", formatPostDate);
  eleventyConfig.addFilter("readTimeFromContent", (content) =>
    getReadTime(content, 240)
  );
  eleventyConfig.addFilter("excerptFromContent", (content, maxWords = 32) => {
    const text = stripMarkup(content);

    if (!text) {
      return "";
    }

    const words = text.split(/\s+/);
    if (words.length <= maxWords) {
      return text;
    }

    return `${words.slice(0, maxWords).join(" ")}...`;
  });
  eleventyConfig.addCollection("blogPosts", function (collectionApi) {
    const orderBySlug = new Map(
      POST_ORDER.map((slug, index) => [slug, index])
    );

    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .filter((item) => !TEMPLATE_POST_FILES.has(path.basename(item.inputPath)))
      .sort((a, b) => {
        const aDate = new Date(a.data.date).getTime();
        const bDate = new Date(b.data.date).getTime();

        if (aDate !== bDate) {
          return bDate - aDate;
        }

        const aSlug = path.basename(a.inputPath, path.extname(a.inputPath));
        const bSlug = path.basename(b.inputPath, path.extname(b.inputPath));
        const aRank = orderBySlug.has(aSlug)
          ? orderBySlug.get(aSlug)
          : Number.MAX_SAFE_INTEGER;
        const bRank = orderBySlug.has(bSlug)
          ? orderBySlug.get(bSlug)
          : Number.MAX_SAFE_INTEGER;

        if (aRank !== bRank) {
          return aRank - bRank;
        }

        return aSlug.localeCompare(bSlug);
      });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
