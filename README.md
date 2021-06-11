# wislin-core

**What I should learn (immediately) next!**

**Pick the best career path based on trends and job listings.**

*This isn't actually the documentation for now I'm just trying to keep my head clear*

## What questions this project will be trying to find an answer to

1. What skills to learn?
2. Which skills to improve upon
3. How many and which jobs can you get in with stuff you know
4. Which jobs you can land once you learned a certain set of skills
5. Sort most requested skills by the effort to learn and salary
6. How related are the skills that you know
7. What's the transition cost? How hard is it to pick up new skill with set of skills you have
8. Recommend resources to learn it. ask from people who know those skills
9. What are the trending technologies and even predict what will become of each technology and tool
10. Maybe enable peoples to submit their progress on learning those new skills? (not sure if possible or reliable)

Skill | RDBMS | Mongodb | Dgraph | RDBMS-Graph | RDBMS-redis | Mongo-redis | Mongo-Graph
--- | --- | --- | --- |--- |--- |--- |--- 
#1 | x00 | x01  | 02 | 03 | 04 | 05 | 06 | 07 
#2 | ✓10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 
#3 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 37 
#4 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 
#4 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 
#5 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57
#6 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 
#7 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 
#8 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 
#9 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 
#10 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 

Explanation

00. for in depth result so many joins is necessary
01. Even worse than RDBMS since it would require many hits to database

## Features to keep in mind

- Let them pick what they actually want. Maybe someone would like to be frontend or someone else might like to pursue
  UI/UX toolsets
- Tagging skills and jobs for example Soft Skill, tech, UI/UX, helps humanity, scientific, frontend, backend... So you
  can filter based on them

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
