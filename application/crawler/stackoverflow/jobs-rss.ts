import download from "../../utils/download"
import { tempFolderPath } from "../../config/application"
import fs from "fs"
import path from "path"
import { STACKOVERFLOW_URL } from "../../config/constants"
import { parseString } from "xml2js"
import Skill from "../../models/skill"

const filename = `stackoverflow-rss-${
  new Date().toISOString().split("T")[0]
}.xml`
const rssPath = path.join(tempFolderPath, "stackoverflow-rss", filename)

async function rssPopulate(): Promise<void> {
  if (!fs.existsSync(rssPath)) {
    await download(`${STACKOVERFLOW_URL}feed`, rssPath)
    extractAndInsert()
  } else {
    extractAndInsert()
  }
}

function extractAndInsert() {
  fs.readFile(rssPath, "utf8", (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    parseString(data, function (err, result) {
      result.rss.channel[0].item.slice(0, 20).map(async (job: any) => {
        if (typeof job.category === "undefined" || job.category.length === 0) {
          console.debug(job)
        } else {
          const skills: number[] = (
            await Promise.all(
              job.category.map((el: string) =>
                Skill.findOne({
                  $or: [{ name: el }, { synonyms: { $in: [el] } }],
                })
              )
            )
          ).reduce<number[]>(
            (filtered: number[], el: any, currentIndex: number): number[] => {
              Boolean(el) && filtered.push(el._id)
              !Boolean(el) && console.log(currentIndex, el)
              return filtered
            },
            []
          )
          console.log(job.category, skills)
          if (job.category.length != skills.length) {
            console.debug(job)
            console.log("oh fuck what you gonna do now?")
            return
          }

          // console.table({
          //   guid: job.guid[0]._,
          //   link: job.link[0],
          //   type: STACKOVERFLOW,
          //   author: job["a10:author"][0]["a10:name"],
          //   skills: skills,
          //   title: job.title[0],
          //   description: job.description[0],
          // })
          // Job.findOne({ guid: job.guid }, (err: any, doc: any) => {
          //   !Boolean(doc) &&
          //     Job.collection.insertOne(
          //       {
          //         guid: job.guid[0]._,
          //         link: job.link[0],
          //         type: STACKOVERFLOW,
          //         author: job["a10:author"][0]["a10:name"],
          //         skills: skills,
          //         title: job.title[0],
          //         description: job.description[0],
          //       },
          //       onInsertCallback
          //     )
          // })
        }
      })
    })
  })
}

// setTimeout(mongoose.connection.close, 10)
rssPopulate().then()
