---
layout: project-layout.njk
title: "Groomsfolk Solar System cufflinks"
date: 2023-05-01
permalink: /projects/solar-system-cufflinks/
category: "Personal"
org: "Personal"
summary: "I designed a minimalist representation of a snapshot in time based on the relative positions of the plants in the solar system, to engrave onto cufflinks for my groomsfolk."
thumbnail: /assets/projects/groomsfolk-cufflinks.jpg
---

For my wedding in 2023, as a gift to my Groomsfolk {% sidenote "Yes, folk, two of them were women." %} I wanted to have special cufflinks made and also for myself to celebrate the occasion. My idea was to have a minimalist representation of the relative alignment of the planets in the solar system at a given point in time{% sidenote "Half my Groomsfolk were also physicists and the others were nerdy enough to enjoy it anyway." %}. My set was aligned set to the orientation of the planets on my wedding day itself (and the time of the ceremony, which is actually, just barely noticeable). 

The original code for this was a Python script using `Skyfield` for the astronomical calculations {% sidenote "Which I had to wrangle from being a projection of positions in the sky to being their relative physical positions." %} to get the planets' orientations. Opinions were divided as to whether people wanted to include the orbit of the moon as well relative to the Earth, so that was an optional add-on for those who wanted it. 

My friends picked dates special to them, from birthdays, anniversaries and even the date of the Moon landing. I would call it, humbly, a great success. Once I had the design as SVG files (pure black on transparent alpha) I used an Etsy supplier who did custom engravings on cufflinks. In short, each cufflink is a special representation of a particular moment in time.

Below, I've thrown together a JavaScript {% sidenote "I know, I can't keep this website pure CSS and HTML... :(" %} version which allows you to download your own versions in SVG form. 

<div id="planets-applet"></div>
<script src="/assets/js/planets.js" defer></script>

## What it does

The applet runs entirely in vanilla JavaScript, vibecoded by Claude from my original Python script. The planets are drawn on normalised orbital rings, with the angle taken from their heliocentric right ascension. The Moon can be shown relative to Earth, labels can be toggled on, and the current view can be downloaded as a standalone SVG.

