---
layout: project-layout.njk
title: "The price of space: rent per square metre across England & Wales"
date: 2025-12-18
permalink: /projects/rents-per-square-metre/
category: "Data consulting"
org: "YIMBY Alliance"
summary: "I built the dataset behind YIMBY Alliance's map of median rent per square metre for every local authority in England and Wales."
thumbnail: /assets/projects/rents-per-square-metre.jpg
links:
  - label: "Read the YIMBY Alliance write-up"
    url: https://yimbyalliance.org/2025/12/18/how-much-space-can-you-afford-to-rent/
  - label: "Explore the interactive map"
    url: https://maps.yimbyalliance.org/psqm-rents
  - label: "Code on GitHub"
    url: https://github.com/thicknavyrain/rents_per_sq_ft_uk
---

When you rent somewhere, you don't think in square metres — you think in bedrooms and "can I actually afford this?". But the quietly important number, the one that usually stays hidden behind the headline rent, is the **price of space**: how much you pay per square metre. That's the thing I was brought in to measure.

I worked on this as a freelance data consultant for [YIMBY Alliance](https://yimbyalliance.org/), and my job was essentially the whole data half of the project: take two large, slightly awkward open datasets — rental price data from **HM Land Registry** and floor areas from the **EPC** (Energy Performance Certificate) register — and wrangle them into a single, trustworthy figure for median rent per square metre in every local authority in England and Wales.

## What that actually involved

The fun (and the pain) is in the joining. Rents and floor areas live in different places, in different shapes, with different ideas about what a "property" is, so a lot of the work was careful matching, cleaning, and sanity-checking before any number was allowed near a map. The output is a tidy dataset covering all 316 local authorities — the thing that powers YIMBY's interactive map and the analysis in their write-up.

## What it shows

Once you can see the price of space, the geography of it is pretty stark. Rent per square metre averages about £15/month nationally, but ranges from roughly **£7–8** in places like Hartlepool, Powys and County Durham to around **£44.60 in Westminster** — a sixfold difference for the *same* unit of space. London space costs more than twice as much, on average, as space everywhere else.

My favourite finding — the one I didn't expect — is that in about **seven in ten local authorities, one-bed flats cost *more* per square metre than three-beds**. Single renters are quietly paying a premium for every metre they occupy, on top of facing the highest overall cost of living.

I find that genuinely worth caring about: minimum space standards are identical across the country, but when the price of a square metre swings from £7 to £45, that single "minimum" means wildly different things depending on your postcode — and in the priciest places it can sit clean out of reach of the people it's meant to protect. Getting the data right felt like the small, useful part I could play in making that visible.
