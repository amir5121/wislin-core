import fs from "fs"
import path from "path"
import minimist from "minimist"
import Seven from "node-7z"
import download from "../utils/download"
import { parseString } from "xml2js"
import Skill from "../models/skill"
import { tempFolderPath } from "../config/application"
import { onInsertCallback } from "../config/mongoose"

const filename = "Tags.xml"
const tagsPath = path.join(tempFolderPath, filename)

if (!fs.existsSync(tempFolderPath)) {
  fs.mkdirSync(tempFolderPath)
}

const argv = minimist(process.argv.slice(2), {
  boolean: true
})
console.log(argv, argv.nocache)
const sevenZPath = tagsPath.replace("xml", "7z")


function extractAndInsert() {
  Seven.extractFull(sevenZPath, tempFolderPath)
  fs.readFile(tagsPath, "utf8", (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    parseString(data, function(err, result) {
      console.debug(result.tags.row[0])
      Skill.collection.drop(onInsertCallback)
      Skill.collection.insertMany(result.tags.row.map((el: any) => {
        el = el.$
        return {
          name: el.TagName,
          stackoverflowMeta: {
            excerptPostId: el.ExcerptPostId,
            wikiPostId: el.WikiPostId,
            count: el.Count
          }
        }
      }), onInsertCallback)
      //  save to skills
    })
  })
}

if (!fs.existsSync(tagsPath) || argv.nocache) {
  download(
    "https://archive.org/download/stackexchange/stackoverflow.com-Tags.7z",
    sevenZPath,
    (message => {
      message && console.log("Download finished")
      extractAndInsert()
    })
  )
} else {
  extractAndInsert()
}
