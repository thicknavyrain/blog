---
layout: project-layout.njk
title: "[]HatGPT"
date: 2024-07-01
permalink: /projects/hat-judge/
category: "For fun"
org: "Personal"
summary: "A tablet clamped to a hard hat that ran real object-detection to 'judge' other people's hats and award them scores."
thumbnail: /assets/projects/hat-judge.jpg
# links:
#   - label: "The judging code"
#     url: https://github.com/thicknavyrain
---

For Lord and Lady Carington's Hat Party in 2024{% sidenote "Yes, of course I was invited, weren't you?"%}, I built hat which judges other peoples hats in real-time. The hardware was a microsoft surface pro laptop (screen only) with a front-facing camera, clamped to a hard hat by way of a **cycling phone mount**, worn on my head. When another guest wandered up and tapped the screen, the machine would detect their hat using computer vision, show it back to them whislt performing some *analytical magic* to solemnly appraise their hat and deliver a verdict.

## What I did

The code runs a **YOLOv8** object detection model{% sidenote "If you don't know what object detection is, it's basically when a computer vision algorithm detects an instance of something and surrounds it with a box, [like so](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuyMFvjowKuyWrTene-dyt3mIQlz-B26OB3U1nYLHb7PhIZnEwx4LHbeg&s=10)."%} (trained on Open Images) for live detection. 

Open Images contains a "hat" category but the detection efficiency on the model size with fast enough latency to run in real time wasn't good enough (it didn't find many hats). However, the ability to detect *faces* was very good, so I borrowed that instead. 

The idea, which I'm pretty proud of, was that in Open Images I downloaded *just* the bounding box information from the training/validation/test sets (none of the actual images) and assumed that in every image which contained both a (manually labelled) hat and a face, on average, relative to the position of the bounding box of the *face* in the image, you could probably predict where the hat was. 

In the end, this required nothing more than linear regression on this data using the coordinates of the bounding box for a face in order to predict the four coordinates where the user's hat would be (assuming they were wearing one{% sidenote "This asssumption holds extraordinarily well when you are at a literal hat party. The trick to being a good physicist is picking exactly the right circumstances under which your incredibly dumb approximations will hold."%}). So with just sixteen coefficients you could turn "position of face" into "position of hat". In practice, I then expanded out the size of the "predicted hat" box to allow for large hats{%sidenote "This was a good call on my part, there were some *big* hats."%}, with a fallback that if, by chance, the smaller object detection actually detected a hat, it defaulted to that bounding box instead. 

In short, the algorithm found your hat, cropped it out, and displayed it back to you as the "specimen under assessment". It then animates a swipe of golden-star ratings across two slides of categories.

Attendees' hats were scored on **Exoticness, Artiness, Sophisticatedness, Historicity, Craziness**, then **Biodegradability, Topicality, "Resembles owner"**, and finally a grand **TOTAL SCORE**.

The ambition was to actually have some kind of scoring mechanism based on lightweight final layer activations of some kind but it turned out if you generate random numbers between 1-5, The Barnum Effect takes care of the rest. On the day, when people tapped the screen and watched the AI "think", they were fairly convinced it was doing some kind of assessment. 

## The verdict on the verdict-machine

My hat won **"Most Innovative"** at the party, which seems fair given it was the only hat running a contemporary neural network. Mostly, it's very fun to have people see something so ridiculous running live in front of their faces and then argue with me why the AI's judgement was wrong (but also convinced there was *some* kind of judgement involved).
