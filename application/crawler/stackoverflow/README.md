# Stackoverflow csv links and queries

[First 50k tags](https://data.stackexchange.com/stackoverflow/csv/1743322)

```sql
# Fetching the first 50k
select top 50000 t.id,
  string_agg(TagSynonyms.SourceTagName, '+#+') as synonyms,
  t.tagName,
  e.body as 'excerpt',
  w.body as 'wikiBody'
from tags t
left join Posts e
  on t.ExcerptPostId = e.Id
left join Posts w
  on t.WikiPostId = w.Id
left join TagSynonyms
  on TagSynonyms.TargetTagName = t.tagName
group by t.tagName, e.body, w.body, t.id
order by t.tagName asc
```

[Second 50k tags](https://data.stackexchange.com/stackoverflow/csv/1743329)

```sql
# Fetching the the second 50k
select t.id,
t."count" as tagCount,
  string_agg(TagSynonyms.SourceTagName, '+#+') as synonyms,
  t.tagName,
  e.body as 'excerpt',
  w.body as 'wikiBody'
from tags t
left join Posts e
  on t.ExcerptPostId = e.Id
left join Posts w
  on t.WikiPostId = w.Id
left join TagSynonyms
  on TagSynonyms.TargetTagName = t.tagName
group by t.tagName, e.body, w.body, t.id, t."count"
order by t.tagName asc
OFFSET  50000 ROWS
FETCH NEXT 50000 ROWS ONLY
```

- At the time of writing this there is about 60k tags on stackoverflow
so this probably going to last awhile and be sufficient