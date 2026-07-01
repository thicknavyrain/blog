---
layout: project-layout.njk
title: "Turning election leaflets into data with GPT-4 Vision"
date: 2024-02-27
permalink: /projects/election-leaflets-llm/
category: "Civic tech"
org: "Campaign Lab"
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

Political parties put a lot of of effort into making and delivering leaflets in every sort of election in the UK. Many parties claim, based on their internal data, that this is important and worthwhile (if only so the average voter has literally *some* idea of who the candidates are) and that it's the most-viewed source of campaigning material in any election. Nobody really knows if this works, but we do have some interesting data on leaflets to find out.

The [OpenElections leaflet archive](https://www.openelections.co.uk/), built on work by Prof. Caitlin Milazzo and colleagues (and Democracy Club before them) is an *image* archive crowdsourced from the leaflet recipients. To actually study what candidates actually talk about, you need the contents as structured data, which is what I helped generate{% sidenote "Previously. this was done manually by postgrad students on a smaller sample, whereas with an LLM it can be automated across the whole dataset." %}. In collaboration with Caitlin, at one of [Campaign Lab](https://www.campaignlab.uk/)'s hack nights, I developed a basic vision-LLM powered document extraction pipeline.

Here's an example output from one leaflet, produced as described below:

```
{
    "leaflet": {
        "candidateName": "Mark Fletcher",
        "constituency": "Devizes",
        "politicalParty": "Green Party",
        "electionDate": "",
        "messages": [
            {
                "title": "A 'Living Wage' for all",
                "content": "We think it\u2019s unfair that irresponsible bankers go on earning huge salaries while 4 million UK children live in poverty. We think it\u2019s unfair that the Government have failed to do anything about the growing gap between rich and poor."
            },
            {
                "title": "Protect our NHS",
                "content": "We think it\u2019s unfair that hospitals and health centres are treated like businesses rather than vital public services. We want to make sure no more public money is wasted on badly implemented privatisation schemes."
            }
        ],
        "keyPolicies": [
            {
                "policyTitle": "A 'Living Wage'",
                "policyDescription": "Green MPs will demand a 'Living Wage' to ensure low paid workers earn enough to provide for themselves and their families. We will fight for a fair financial deal, with community banks, credit unions and mutuals providing realistic loans to families and small businesses."
            },
            {
                "policyTitle": "A million new jobs",
                "policyDescription": "Green MPs will press for a free insulation scheme for every single home and for a green package to cut fuel bills and create a million new jobs. Green Party councillors have already pioneered such a scheme in Kirklees."
            },
            {
                "policyTitle": "Protect our NHS",
                "policyDescription": "Green MPs will fight to make sure local services are easy to access and are truly local. We will oppose cuts, closures and privatisation within our NHS and protect the jobs of public sector workers."
            }
        ],
        "mentions": {
            "candidate": "Mark Fletcher",
            "otherPartyLeaderCandidate": "",
            "partyLeader": "",
            "tacticalSituation": ""
        },
        "issues": {
            "brexitEurope": "",
            "economy": "",
            "education": "develop higher education, jobs and small businesses",
            "environment": "every home...for a green package to cut fuel bills",
            "governance": "",
            "health": "Protect our NHS",
            "immigration": "",
            "socialWelfare": "",
            "housing": [
                {
                    "content": "Green MPs will press for a free insulation scheme for every single home and for a green package to cut fuel bills and create a million new jobs.",
                    "yimbyNimby": "N/A"
                }
            ]
        },
        "personalStatement": "",
        "politicalExperience": [
            {
                "role": "",
                "duration": "",
                "achievements": ""
            }
        ],
        "contactInformation": {
            "address": "",
            "phone": "",
            "email": "",
            "website": "www.greenparty.org.uk",
            "socialMedia": {
                "facebook": "",
                "twitter": "",
                "instagram": "",
                "linkedin": ""
            }
        },
        "endorsements": [
            {
                "endorser": "",
                "endorsement": ""
            }
        ],
        "quotes": [
            {
                "text": "",
                "source": "",
                "date": ""
            }
        ],
        "campaignMaterial": {
            "images": [
                {
                    "caption": "Mark Fletcher with constituents"
                }
            ]
        },
        "additionalNotes": "Printed on 100% recycled paper using sustainable technologies that do not harm the environment."
    }
}
```

## What I built

First, a scraper that pulls the leaflet images down from the archive. Each image was sent to GPT-4 Vision{% sidenote "Even in 2026, this already feels quaint."%}, with prompting designed to coax it into returning a consistent JSON structure, the candidate's name, their headline policies, what they say on key issues, contact details, and so on. A final stage cleans and verifies the JSON. Have to hand it to GPT-vision, the error rate was very low and virtually every returned reponse was a valid JSON response (barring some opening/closing tic marks).

The output is you get standardised, structured JSONs for thousands of political leaflets, availablere [here](https://github.com/thicknavyrain/uk_elections_leaflets/tree/main/Leaflets_data_24_02_27). You can start asking questions like what gets emphasised, where, by whom.

I never got around to applying this to the most recent elections but the pipeline is easily adaptable (link above) or, if you have a defined use case for it and you bug me enough, I can be talked into running the pipeline for more recent leaflets. 