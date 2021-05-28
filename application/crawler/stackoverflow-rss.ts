import download from "../utils/download"
import { tempFolderPath } from "../config/application"
import fs from "fs"
import path from "path"
import { STACKOVERFLOW, STACKOVERFLOW_URL } from "../config/constants"
import { parseString } from "xml2js"
import Skill from "../models/skill"
import Job from "../models/job"
import { onInsertCallback } from "../config/mongoose"

const filename = `stackoverflow-rss-${
  new Date().toISOString().split("T")[0]
}.xml`
const rssPath = path.join(tempFolderPath, "stackoverflow-rss", filename)
if (!fs.existsSync(rssPath)) {
  download(`${STACKOVERFLOW_URL}feed`, rssPath, (message) => {
    message && console.log("Download finished")
    extractAndInsert()
  })
} else {
  extractAndInsert()
}

function extractAndInsert() {
  fs.readFile(rssPath, "utf8", (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    parseString(data, { trim: true }, function (err, result) {
      result.rss.channel[0].item.slice(1, 3).map(async (job: any) => {
        if (typeof job.category === "undefined" || job.category.length === 0) {
          console.debug(job)
        } else {
          const skills: number[] = (
            await Promise.all(
              job.category.map((el: string) => Skill.findOne({ name: el }))
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
          Job.findOne({ guid: job.guid }, (err: any, doc: any) => {
            !Boolean(doc) &&
              Job.collection.insertOne(
                {
                  guid: job.guid[0]._,
                  link: job.link[0],
                  type: STACKOVERFLOW,
                  author: job["a10:author"][0]["a10:name"],
                  skills: skills,
                  title: job.title[0],
                  description: job.description[0],
                },
                onInsertCallback
              )
          })
        }
      })
    })
  })
}

// setTimeout(mongoose.connection.close, 10)
