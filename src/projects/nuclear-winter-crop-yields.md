---
layout: project-layout.njk
title: "What happens to the harvest after a nuclear winter?"
date: 2024-10-03
permalink: /projects/nuclear-winter-crop-yields/
category: "Volunteer research"
org: "ALLFED"
summary: "Volunteer research for ALLFED: quantifying how crop and grass yields change, country by country, under different nuclear-winter soot scenarios."
thumbnail: /assets/projects/nuclear-winter-crop-yields.png
links:
  - label: "Code & results on GitHub"
    url: https://github.com/thicknavyrain/nw-crop-yield-change-2024
  - label: "ALLFED — Alliance to Feed the Earth in Disasters"
    url: https://allfed.info/
---

I did some volunteer research for [ALLFED](https://allfed.info/), the Alliance to Feed the Earth in Disasters. They're an EA-adjacent/global catastrophic risk research group looking at how we'd keep feeding everyone if something catastrophic knocked out normal agriculture. In this case the catastrophe was a nuclear winter: enough soot thrown into the upper atmosphere to dim the sun in an exchange of nuclear weapons to cool the planet and wreck growing seasons worldwide.

## What I worked on

The task was to turn climate-model output into a figure for crop-losses. Starting from the crop and grass yield datasets of [Xia et al. (2022)](https://www.nature.com/articles/s43016-022-00573-0), distributed as big NetCDF gridded files across a range of soot-injection scenarios, I built the pipeline that calculates the percentage change in yields, crop by crop and country by country, for the first ten years after the event.

In practice that mostly meant geospatial plumbing: reading the gridded NetCDF data, aggregating it up to country level against a shapefile, computing year-by-year yield changes for each scenario, and writing it all out as clean CSVs plus visualisations so the numbers could actually be read. (Everything's reproducible with Poetry, and the processed outputs are committed so you don't have to run a thing to see the results.)