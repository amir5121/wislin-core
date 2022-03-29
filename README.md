# Wislin Core

**What I should learn (immediately) next!**

**Pick the best career path based on trends and job listings.**

*This isn't actually the documentation for now I'm just trying to keep my head clear*

## What questions this project will be trying to find an answer to

First is need to gather info

- Choose from the skills that users have picked so far
- From the jobs you have crawled

01. What skills to learn?
    - Filters
        - Passed 5 years for example
        - Pay range
        - Location based querying
        - Personality trails?
    - Questions
        - What's the required experience
        - How skills are related to one another
        - What's the pay range
        - Tag the skills with science, personality traits
        - How hard is it to learn
        - Skills have date as well
            - for jobs is when it as crawled
            - for people, it's when they last used it

02. Which skills to improve upon?
    - to answer this you need to know the required experience
03. Gather info on whether your recommendation was any good
    - well this comes after you generated the data
    - plus need to take into account the result:
        - one approach is to generate the result in multiple ways and see which brings a more positive feedback
        - other than that you might be able to do a time base upgrade. gather response and feedback and try to improve
          upon that
        - this might require me to save the users query give them an id or other stuff
04. Job recommendation
    - Since I want to take experience into account, I would need to rate the jobs

05. Which jobs you can land once you learned a certain set of skills?
    - Same as job recommendation but which skill they are looking into is also considered they have learned
06. Sort most requested skills by the effort to learn and salary
07. What's the transition cost? How hard is it to pick up new skill with set of skills you have
    - I need to find a way to check how long it takes to learn something maybe do how long does it take to lean 20% how
      long does it learn 80%
08. Recommend resources to learn it. ask from people who know those skills
09. What are the trending technologies and even predict what will become of each technology and tool
10. Maybe enable peoples to submit their progress on learning those new skills? (not sure if possible or reliable)
11. Maybe you can tag personality traits you might even be able to recommend based on peoples personality thought you
    need to figure out how to gather that info. Maybe ask the people
12. How related are the skills that you know

### So based on those features what data would you need to keep track of?

#### Skill

- name and synonyms
- difficulty to learn
- list of tags including (scientific, personality trait, ...)
- stacks (tech, ui-ux, ... )

#### Job

- Title
- Pay
- Location
- stack (tech, ui-ux, ... )
- skills (List of skills)

## Features to keep in mind

- Let them pick what they actually want. Maybe someone would like to be frontend or someone else might like to pursue
  UI/UX toolsets
- Tagging skills and jobs for example Soft Skill, tech, UI/UX, helps humanity, scientific, frontend, backend... So you
  can filter based on them
- one might already know that you are suggesting let them say that they know that

## I'm writing these out because I'm trying to find the right tool set for this project.

- Do I need to go with dgraph? (not going with neo4j since it asks for money, and I can't afford that)
- Is it enabling enough?
- Or do I want to go with like mongo and then aggregate the data into a graph database?
- Or just go with a RDBMS and cache all you need?
- is caching a graph possible when you need to query it with different inputs?

# Initialize

## Populate the skills DB

```shell
npm run populate [-- [--nocache]]
npm run rss
```

# User journey

- The site can be opened in two places
    - Home page
        - if you open up a home page you could search for a skill you have and find relevant skills then you continue on
          the skill landing
        - This is flawed since you generally have more than one skill, so you need to be able to pick multiple skill,
          and I need to figure out how to connect the dots
        - To overcome this you can imagine all the picked skills a node and traverse your graph like that
        - I don't know if this is possible in neo4j. So I need to look that up

    - A Skill Landing

## ----- Notes to my self ------

this should become a cron job or something

        tsc && node -r dotenv/config ./dist/crawler/stackoverflow/jobs-rss.js

## RSS

- [indeed](https://rss.indeed.com/rss)
- [stackoverflow](https://stackoverflow.com/jobs/feed)

dependency for [node-7z](https://github.com/quentinrossetti/node-7z) is `p7zip-full` on linux

remember check out greenhouse it's [pi](https://developers.greenhouse.io/harvest.html#get-list-jobs) 

code academy career path
