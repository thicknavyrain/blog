---
layout: post-layout.njk
title: Post Template 01
date: 2025-10-12
readTime: 8 min read
tags: writing, research
permalink: /posts/post-template-1.html
---

Use this layout for longform posts. It includes a variety of standard elements you might find in a Jekyll theme: headings, lists, quotes, code blocks, images, and tables.

## Section heading

Start with a short introduction. Keep paragraphs brief and readable. You can include inline code like `const note = "example";`. Use Tufte-style footnotes for side commentary. {% sidenote "This is a sidenote that sits in the margin on wide screens and drops inline on small screens." %}

### Subheading with list

- Primary insight or thesis.
- Supporting argument with context.
- Closing thought or question.

> “A quiet interface can encourage a louder voice.” — Add quotes or pull lines here.

Reference works can live in the margin as linked sidenotes.{% sidenote "See <a href='https://www.edwardtufte.com/tufte/books_vdqi' target='_blank' rel='noreferrer'>The Visual Display of Quantitative Information</a> for a foundational reference." %}

This sentence includes a numbered footnote reference<sup class="footnote-ref">1</sup>.
<span class="sidenote footnote-note"><span class="footnote-index">1.</span>Example of a numbered reference note in the margin.</span>

### Code sample

```
function collectNotes(entries) {
  return entries.filter(Boolean).map(entry => ({
    title: entry.title,
    excerpt: entry.body.slice(0, 140),
  }));
}
```

### Inline media note

Add an image or figure reference here. You can drop a photo, illustration, or data visualization inside the template.

<figure>
  <figcaption>
    Figure 1: A simple image embed with a descriptive caption.
  </figcaption>
  <img
    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
    alt="A desk with open notebooks and a cup of coffee."
  />
</figure>

A margin figure can sit beside the text for quick visual context.
<label class="margin-toggle" for="mn-figure-1">&#8853;</label>
<input class="margin-toggle" type="checkbox" id="mn-figure-1" />
<span class="marginnote">
  <img
    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80"
    alt="A margin figure example."
  />
  <span class="margin-caption">Margin figure with a short caption.</span>
</span>

<figure class="fullwidth">
  <img
    src="https://images.unsplash.com/photo-1473181488821-2d23949a045a?auto=format&fit=crop&w=1600&q=80"
    alt="A wide landscape used for a full-width figure example."
  />
  <figcaption>
    Full-width figure example inspired by the Tufte CSS layout.
  </figcaption>
</figure>

### Equation sample

**Equation:** E = mc<sup>2</sup>

For more complex math, you can use a preformatted block and render it with your preferred math library later:

```
\[
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
\]
```

### Table sample

<table>
  <thead>
    <tr>
      <th>Phase</th>
      <th>Focus</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Research</td>
      <td>Collect archival sources</td>
      <td>Complete</td>
    </tr>
    <tr>
      <td>Drafting</td>
      <td>Outline narrative</td>
      <td>In progress</td>
    </tr>
    <tr>
      <td>Revision</td>
      <td>Peer review</td>
      <td>Upcoming</td>
    </tr>
  </tbody>
</table>

## Conclusion

Wrap up with a summary, next steps, or a call to action. Provide links to related posts or resources. Add a marginal note for extra context.
<label class="margin-toggle" for="mn-1">&#8853;</label>
<input class="margin-toggle" type="checkbox" id="mn-1" />
<span class="marginnote">Marginal notes are great for supplementary context or citations.</span>
