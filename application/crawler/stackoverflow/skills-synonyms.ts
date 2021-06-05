import fs from "fs"
import path from "path"
import minimist from "minimist"
import Seven from "node-7z"
import download from "../../utils/download"
import { parseString } from "xml2js"
import Skill from "../../models/skill"
import { tempFolderPath } from "../../config/application"
import { onInsertCallback } from "../../config/mongoose"
import csv from "csv-parser"

const filename = "Tags.xml"
const tagsPath = path.join(tempFolderPath, filename)
const synonymsPath = path.join(tempFolderPath, "stackoverflow-synonyms.csv")

interface XMLSkill {
  $: {
    TagName: string
    ExcerptPostId: string
    WikiPostId: string
    Count: string
  }
}

if (!fs.existsSync(tempFolderPath)) {
  fs.mkdirSync(tempFolderPath)
}

const argv = minimist(process.argv.slice(2), {
  boolean: true,
})
console.log("populate-db ARGUMENTS:", argv, argv.nocache)
const sevenZPath = tagsPath.replace("xml", "7z")

function extractTagsAndInsert(skills: string[]) {
  Seven.extractFull(sevenZPath, tempFolderPath)
  fs.readFile(tagsPath, "utf8", (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    parseString(data, async function (err, result) {
      const newSkills = result.tags.row.reduce(
        (filtered: {}[], el: XMLSkill) => {
          if (!skills.includes(el.$.TagName)) {
            filtered.push({
              name: el.$.TagName,
              stackoverflowMeta: {
                excerptPostId: el.$.ExcerptPostId,
                wikiPostId: el.$.WikiPostId,
                count: el.$.Count,
              },
            })
          }
          return filtered
        },
        []
      )
      if (newSkills.length > 0) {
        Skill.collection.insertMany(newSkills, onInsertCallback)
      }
    })
  })
}

function updateSynonyms(skills: string[]): void {
  const synonyms: any[] = []
  fs.createReadStream(synonymsPath)
    .pipe(csv())
    .on("data", async (data) => {
      if (skills.includes(data.TargetTagName)) {
        if (synonyms.hasOwnProperty(data.TargetTagName)) {
          synonyms[data.TargetTagName].push(data.SourceTagName)
        } else {
          synonyms[data.TargetTagName] = [data.SourceTagName]
        }
      }
    })
    .on("end", async () => {
      for (const [key, value] of Object.entries(synonyms)) {
        const skill = await Skill.findOne({ name: key }).exec()
        if (skill) {
          const newSynonyms = [...new Set((skill.synonyms || []).concat(value))]
          if (skill.synonyms.length > newSynonyms.length) {
            skill.synonyms = newSynonyms
            await skill.save()
          }
        } else {
          console.warn(
            `### TSH ---- Skill not found ${key} to populate synonym`
          )
        }
      }
      console.log("Finished loading synonyms")
    })
}

async function populate() {
  const skills = (await Skill.find({}, "name").exec()).map((el) => el.name)
  if (
    !fs.existsSync(tagsPath) ||
    !fs.existsSync(synonymsPath) ||
    argv.nocache
  ) {
    await download(
      "https://archive.org/download/stackexchange/stackoverflow.com-Tags.7z",
      sevenZPath
    )
    extractTagsAndInsert(skills)
    await download(
      "https://data.stackexchange.com/stackoverflow/csv/1742806",
      synonymsPath
    )
    await updateSynonyms(skills)
  } else {
    extractTagsAndInsert(skills)
    await updateSynonyms(skills)
  }
  console.log("This should run at the very end but i dunno what is happening")
}

populate().then(() => console.log("finished populating"))
