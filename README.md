# wislin-core

What I should learn (immediately) next!

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
