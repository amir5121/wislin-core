# wislin-core

*What I should learn (immediately) next!*

## What questions this project will be trying to find an answer to

- What are the trending technologies
- What skills to learn?
- Should improve upon your current skill sets
- How related are the skills that you know
- How hard is it to pick up and transition to the new still
- How long does it take to learn that skill-concept for someone with your current knowledge
- Recommend resources to learn it. ask from people who know those skills
- Maybe enable peoples to submit their progress on learning those new skills? (not sure if possible or reliable)
- Let them pick what they actually want. Maybe someone would like to be front-end dev someone else might like to pursue
  UI/UX toolsets
- Tagging skills and jobs for example Soft Skill, tech, UI/UX, helps humanity, scientific, frontend, backend... So you
  can filter based on them
- You might even be able to recommend system designs based on skill tags

I'm writing these out because I'm trying to find the right tool set for this project.

- Do I need to go with dgraph? (not going with neo4j since it asks for money, and I can't afford that)
- Is it enabling enough?
- Or do I want to go with like mongo and then aggregate the data into a graph database?
- Or just go with a RDBMS and cache all you need?
- is caching a graph possible when you need to query it with different inputs?

### By the looks of it I'm apparently not so good at focusing let's write the thought process


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
