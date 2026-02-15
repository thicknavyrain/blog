module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("sidenote", function (content) {
    const id = "sn-" + Math.random().toString(36).substr(2, 9);
    return `
      <label class="margin-toggle sidenote-number" for="${id}"></label>
      <input class="margin-toggle" type="checkbox" id="${id}" />
      <span class="sidenote">${content}</span>
    `;
  });

  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
