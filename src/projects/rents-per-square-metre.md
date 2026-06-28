---
layout: project-layout.njk
title: "The price of space: rent per square metre across England & Wales"
date: 2025-12-18
permalink: /projects/rents-per-square-metre/
category: "Data consulting"
org: "YIMBY Alliance"
summary: "I built the dataset behind YIMBY Alliance's map of median rent per square metre for every local authority in England and Wales."
thumbnail: /assets/projects/rents-per-square-metre.png
links:
  - label: "Read the YIMBY Alliance write-up"
    url: https://yimbyalliance.org/2025/12/18/how-much-space-can-you-afford-to-rent/
  - label: "Explore the interactive map"
    url: https://maps.yimbyalliance.org/psqm-rents
  - label: "Code on GitHub"
    url: https://github.com/thicknavyrain/rents_per_sq_ft_uk
---

Surprisingly, there was no pre-existing dataset spanning England and Wales for the **price of space**: how much you pay per square metre when you rent a flat. That's the thing I helped create.

I worked on this as a freelance data consultant for [YIMBY Alliance](https://yimbyalliance.org/), compiling the data half of the project: take two large, slightly awkward open datasets (rental price data from **HM Land Registry** and floor areas from the **EPC** (Energy Performance Certificate) register) and wrangle into a figure for median rent per square metre in every local authority in England and Wales.

## What I did

Rents and floor areas live in different places, in different shapes, with different ideas about what a "property" is, so a lot of the work was careful matching, cleaning, and sanity-checking the figures before a join between the constituent datasets. The output is a tidy dataset covering all 316 local authorities, the thing that powers YA's interactive map and the analysis in their write-up.

## What it showed

Once you can see the price of space, the geography of it is pretty stark. Rent per square metre averages about £15/month nationally, but ranges from roughly **£7–8** in places like Hartlepool, Powys and County Durham to around **£44.60 in Westminster**, a sixfold difference for the *same* unit of space. London space costs more than twice as much, on average, as space everywhere else.

In **seven in ten local authorities, one-bed flats cost *more* per square metre than three-beds**. Single renters are quietly paying a premium for every metre they occupy, on top of facing the highest overall cost of living.

In other words, minimum space standards are identical across the country, but when the price of a square metre swings from £7 to £45, that single "minimum" means wildly different things depending on your postcode. The implication is that the priciest places sit out of reach of lower income communities the standards are meant to be protecting the welfare of. Getting the data right felt like the small, useful part I could play in making that visible.
