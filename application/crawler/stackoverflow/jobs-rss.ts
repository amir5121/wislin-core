import download from "../../utils/download"
import { stackoverflowRssPath } from "../../config/application"
import fs from "fs"
import path from "path"
import { STACKOVERFLOW, STACKOVERFLOW_URL } from "../../config/constants"
import { parseString } from "xml2js"
import Skill, { SkillDocument } from "../../models/skill"
import Job from "../../models/job"

const filename = `stackoverflow-rss-${
  new Date().toISOString().split("T")[0]
}.xml`
const rssPath = path.join(stackoverflowRssPath, filename)

async function rssPopulate(): Promise<void> {
  if (!fs.existsSync(stackoverflowRssPath)) {
    fs.mkdirSync(stackoverflowRssPath)
  }
  if (!fs.existsSync(rssPath)) {
    await download(`${STACKOVERFLOW_URL}feed`, rssPath)
  }
  extractAndInsert()
}

let updatedCount = 0

function extractAndInsert() {
  fs.readFile(rssPath, "utf8", (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    parseString(data, async function (err, result) {
      result.rss.channel[0].item.map(async (job: any) => {
        console.log("@@@@@", job)
        if (typeof job.category === "undefined" || job.category.length === 0) {
          console.debug(job)
        } else {
          const skills: SkillDocument[] = (
            await Promise.all(
              job.category.map((el: string) =>
                Skill.findOne({
                  $or: [{ name: el }, { synonyms: { $in: [el] } }],
                })
              )
            )
          ).reduce<SkillDocument[]>(
            (filtered: SkillDocument[], el: any): SkillDocument[] => {
              Boolean(el) && filtered.push(el)
              // !Boolean(el) && console.log(currentIndex, el)
              return filtered
            },
            []
          )
          if (job.category.length != skills.length) {
            const skillsNameSynonyms = skills.reduce(
              (filtered: string[], it) => {
                filtered.push(it.name)
                return filtered.concat(it.synonyms)
              },
              []
            )
            console.log(
              "missing skills:",
              job.category.filter(
                (el: string) => !skillsNameSynonyms.includes(el)
              ),
              job.link[0]
            )
            return
          } else {
            updatedCount++
            await Job.updateOne(
              { guid: job.guid[0]._, type: STACKOVERFLOW },
              {
                guid: job.guid[0]._,
                link: job.link[0],
                type: STACKOVERFLOW,
                location:
                  typeof job.location !== "undefined"
                    ? job.location[0]._
                    : null,
                author: job["a10:author"][0]["a10:name"][0],
                skills: skills.map((el) => el._id),
                title: job.title[0],
                description: job.description[0],
              },
              { upsert: true, setDefaultsOnInsert: true }
            )
          }
        }
      })
      console.log("updated jobs:", updatedCount, await Job.countDocuments())
    })
  })
}

// setTimeout(mongoose.connection.close, 10)
rssPopulate().then()
