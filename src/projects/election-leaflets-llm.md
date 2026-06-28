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

Political parties put reams of effort in making and delivering leaflets in every sort of election in the UK. Many parties claim their internal data suggests that this is important (if only so the average voter has literally *some* idea of who the candidates are) and that it's the most-viewed source of campaigning material in any election. Nobody really knows if this works, but we do have some interesting data on leaflets to find out.

The [OpenElections leaflet archive](https://www.openelections.co.uk/), built on work by **Prof. Caitlin Milazzo** and colleagues (and Democracy Club before them) is an *image* archive crowdsourced from the leaflet recipients. To actually study what candidates actually talk about, you need the contents as structured data, which is what I helped generate. In collaboration with Caitlin, at one of [Campaign Lab](https://www.campaignlab.uk/)'s winter hack nights, I developed a basic vision-LLM powered document extraction pipeline.

## What I built

First, a scraper that pulls the leaflet images down from the archive. Each image was sent to **GPT-4 Vision**, with prompting designed to coax it into returning a consistent **JSON structure**, the candidate's name, their headline policies, what they say on key issues, contact details, and so on. A final stage cleans and verifies the JSON. Have to hand it to GPT-vision, the error rate was very low and virtually every returned reponse was a valid JSON response (barring some opening/closing tic marks).

The output is you get standardised, structured JSONs for thousands of political leaflets, availablere [here](https://github.com/thicknavyrain/uk_elections_leaflets/tree/main/Leaflets_data_24_02_27). You can start asking questions like what gets emphasised, where, by whom.