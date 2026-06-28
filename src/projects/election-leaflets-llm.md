---
layout: project-layout.njk
title: "Turning election leaflets into data with GPT-4 Vision"
date: 2024-02-27
permalink: /projects/election-leaflets-llm/
category: "Civic tech"
org: "Campaign Lab · with Prof. Caitlin Milazzo"
summary: "An LLM-powered pipeline that scrapes UK campaign leaflets and parses the images into structured, analysable data."
thumbnail: /assets/projects/election-leaflets-llm.jpg
links:
  - label: "Code on GitHub"
    url: https://github.com/thicknavyrain/uk_elections_leaflets
  - label: "OpenElections leaflet archive"
    url: https://www.openelections.co.uk/
  - label: "Campaign Lab"
    url: https://www.campaignlab.uk/
---

Political campaign leaflets are a strange, under-studied corner of democracy: millions of them get pushed through letterboxes every election, each one a tiny, deliberate statement of what a candidate wants you to believe they care about — and then almost all of them go straight in the recycling, their contents never systematically analysed.

There's a wonderful archive that fights this: the [OpenElections leaflet archive](https://www.openelections.co.uk/), built on work by **Prof. Caitlin Milazzo** and colleagues (and Democracy Club before them). The catch is that it's a pile of *images*. To actually study what candidates say, you need the contents as structured data — and that's the problem I took on, in collaboration with Caitlin, at one of [Campaign Lab](https://www.campaignlab.uk/)'s winter hack nights.

## What I built

A two-stage pipeline. First, a scraper that pulls the leaflet images down from the archive. Then the interesting part: each image gets sent to **GPT-4 Vision**, with prompting designed to coax it into returning a consistent **JSON structure** — the candidate's name, their headline policies, what they say on key issues, contact details, and so on. A final stage cleans and verifies the JSON, because letting a vision model loose on a few thousand leaflets produces exactly the kind of cheerful inconsistency you'd expect.

It was very much a hack-night build — assembled fast, with a healthy mix of trial-and-error and guesswork — but it works, and it points at something I find genuinely exciting: the boring-but-democratically-useful task of reading a vast pile of campaign material is now largely automatable. You can start asking questions across *thousands* of leaflets — what gets emphasised, where, by whom — instead of laboriously coding a sample by hand.

I love this one because it's politics-as-data done from the bottom up: not polls or grand pronouncements, but the actual paper that lands on actual doormats, finally made legible at scale.
