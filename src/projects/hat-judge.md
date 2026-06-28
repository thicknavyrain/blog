---
layout: project-layout.njk
title: "[]HatGPT"
date: 2024-07-01
permalink: /projects/hat-judge/
category: "For fun"
org: "Carington Hat Party"
summary: "A tablet clamped to a hard hat that ran real object-detection to 'judge' other people's hats and award them scores."
thumbnail: /assets/projects/hat-judge.jpg
# links:
#   - label: "The judging code"
#     url: https://github.com/thicknavyrain
---

For Lord and Lady Carington's Hat Party in 2024, I built wearable, camera-equipped, artificially intelligent hat-judging machine. The hardware was a microsoft surface pro laptop (screen only) with a front-facing camera, clamped to a hard hat by way of a **cycling phone mount**, worn on my head. When another guest wandered up and tapped the screen, the machine would solemnly appraise their hat and deliver a verdict.

## What I did

The code runs a **YOLOv8** model (trained on Open Images) for live detection. Open Images contains a "hat" category but the detection efficiency on a model with small enough latency to run in real time wasn't good enough. However, the ability to detect *faces* was very good, so I borrowed that instead. The code registers a forward hook on an inner layer to pull out feature activations, and uses a little **linear regression**, mapping the detected face box and the presence of various objects to a predicted hat location, so it can find your hat, crop it out, and display it back to you as the "specimen under assessment". It then animates a swipe of golden-star ratings across two slides of categories.

Attendees' hats were scored on **Exoticness, Artiness, Sophisticatedness, Historicity, Craziness**, then **Biodegradability, Topicality, "Resembles owner"**, and finally a grand **TOTAL SCORE**.

The ambition was to actually have some kind of scoring mechanism based on lightweight final layer activations of some kind but it turned out if you generate random numbers between 1-5, The Barnum Effect takes care of the rest. On the day, when people tapped the screen and watched the AI "think", they were fairly convinced it was doing some kind of assessment. 

## The verdict on the verdict-machine

It won **"Most Innovative"** at the party, which seems fair given it was the only hat running a contemporary neural network, live. Mostly, it's very fun to have people see something so ridiculous running live in front of their faces and then argue with me why the AI's judgement was wrong (but also convinced there was *some* kind of judgement involved).
