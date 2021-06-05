import fs from "fs"
import path from "path"
import minimist from "minimist"
import download from "../../utils/download"
import Skill from "../../models/skill"
import { stackoverflowPath } from "../../config/application"
import csv from "csv-parser"

const tagsPath = path.join(stackoverflowPath, "stackoverflow-tags.csv")

const argv = minimist(process.argv.slice(2), {
  boolean: true,
})
console.log("populate-db ARGUMENTS:", argv, argv.nocache)

function updateSynonyms(csvFilePath: string): void {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", async (data) => {
      await Skill.updateOne(
        { name: data.tagName },
        {
          name: data.tagName,
          synonyms: data.synonyms ? data.synonyms.split("+#+") : undefined,
          stackoverflowMeta: {
            guid: data.id,
            excerpt: data.excerpt,
            wiki: data.wikiBody,
            count: data.tagCount,
          },
        },
        { upsert: true, setDefaultsOnInsert: true }
      )
    })
    .on("end", async () => {
      console.log("Finished loading", csvFilePath)
    })
}

async function populate() {
  if (!fs.existsSync(stackoverflowPath)) {
    fs.mkdirSync(stackoverflowPath)
  }

  const stackoverflowLinks = [
    "https://data.stackexchange.com/stackoverflow/csv/1743322",
    "https://data.stackexchange.com/stackoverflow/csv/1743329",
  ].map((el, index) => {
    return {
      link: el,
      filePath: tagsPath + "." + index,
    }
  })
  for (const stackoverflowLink of stackoverflowLinks) {
    if (!fs.existsSync(stackoverflowLink.filePath) || argv.nocache) {
      await download(stackoverflowLink.link, stackoverflowLink.filePath)
    }
    await updateSynonyms(stackoverflowLink.filePath)
  }
  console.log("This should run at the very end but i dunno what is happening")
}

populate().then(() => console.log("finished populating"))
