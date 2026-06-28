---
layout: project-layout.njk
title: "An AI hard-hat that judges your hat (badly, on purpose)"
date: 2024-07-01
permalink: /projects/hat-judge/
category: "For fun"
org: "Carington Hat Party"
summary: "A tablet clamped to a hard hat that ran real object-detection to 'judge' other people's hats and award them gloriously arbitrary scores."
thumbnail: /assets/projects/hat-judge.jpg
links:
  - label: "The judging code"
    url: https://github.com/thicknavyrain
---

For Lord and Lady Carington's Hat Party in 2024, I built the thing the occasion clearly demanded: a wearable, camera-equipped, artificially intelligent hat-judging machine. The hardware was a tablet with a front-facing camera, clamped to a hard hat by way of a **cycling phone mount**, worn on my head. When another guest wandered up and tapped the screen, the machine would solemnly appraise their hat and deliver a verdict.

## How it "works"

Here's the part I'm quietly proud of: the computer-vision scaffolding is completely real. The code runs a **YOLOv8** model (trained on Open Images) for live detection, registers a forward hook on an inner layer to pull out feature activations, and uses a little **linear regression** — mapping the detected face box and the presence of various objects to a predicted hat location — so it can find your hat, crop it out, and display it back to you as the "specimen under assessment". It then animates a swipe of golden-star ratings across two slides of categories.

The categories are where my commitment to rigour wavered. Your hat is scored on **Exoticness, Artiness, Sophisticatedness, Historicity, Craziness**, then **Biodegradability, Topicality, "Resembles owner"**, and finally a grand **TOTAL SCORE**.

I'll let you guess how those numbers were arrived at. On the day, when people tapped the screen and watched the AI "think", I was careful to leave the exact mechanism... ambiguous. The genuine detection pipeline doing visible work on screen made the whole thing land as plausibly clever. Whether the scores reflected any actual property of your hat is a question I declined to answer in person, and will continue to decline to answer here. (Those who've read the source code may draw their own conclusions about `random`.)

## The verdict on the verdict-machine

It won **"Most Innovative"** at the party, which I choose to read as the universe rewarding effort-to-silliness ratio. Easily one of the most fun things I've built — a real ML pipeline doing honest work in service of a completely dishonest premise.
