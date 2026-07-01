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

For my wedding in 2023, as a gift to my Groomsfolk {% sidenote "Two of them were women, but I think leaving the term ungendered is nicer in any case." %} I wanted to have special cufflinks made for them and myself to celebrate the occasion. My idea was to have a minimalist representation of the relative alignment of the planets in the solar system at a given point in time{% sidenote "Half my Groomsfolk were also physicists and the others were nerdy enough to enjoy it anyway." %}. My pair was set to the orientation of the planets on my wedding day itself (and the time of the ceremony, which is actually just barely noticeable if you compare it to the same day at midnight). 

## How they were made

The original code for this was a Python script using `Skyfield` for the astronomical calculations {% sidenote "Which I had to wrangle from being a projection of each body's position in the sky to being their relative physical positions." %} to get the planets' positions with respect to each other. Opinions amongst the 'folk were divided as to whether to include the orbit of the moon as well, relative to the Earth, so that was an optional add-on for those who wanted it. 

My friends picked dates special to them, from birthdays to anniversaries and even the date of the Moon landing. I would call it, humbly, a great success. Once I had the design as SVG files (pure black on transparent background) I used an Etsy supplier{% sidenote "I used [this particular one](https://www.etsy.com/uk/listing/1466235403/logo-cuff-links-photo-cufflinks), to whom I have no affiliation whatsoever, I'm sure this is a fairly generic business." %} who did custom engravings on cufflinks. In short, each cufflink is a special representation of a particular moment in time.

Below, I've thrown together a JavaScript {% sidenote "I know, I can't keep this website pure CSS and HTML... :(" %} version which allows you to download your own versions in SVG form. 

<div id="planets-applet"></div>
<script src="/assets/js/planets.js" defer></script>

## On the app

The applet runs entirely in vanilla JavaScript, vibecoded by Claude based on my original Python script. 

## Why no Pluto?

I'm an (ex-) particle physicist, I don't have skin in the game for this particular debate but in short, because I'm a clueless shill for the International Astronomical Union and also, more importantly, I was worried nine rings would make the whole design shrink down too much to resolve the details, which was already a risk. Thankfully, in the final product (see the photo above) the details of the planets still come out nicely. Also, I gave you the moon, come on, that's good enough.