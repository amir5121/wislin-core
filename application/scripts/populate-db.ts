import fs from "fs";
import minimist from "minimist";
import Seven from "node-7z";
import download from "../utils/download";
import { parseString } from "xml2js";

const tempPath = "./temp/";
const filename = "Tags.xml";
const tagsPath = tempPath + filename;

if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath);
}

const argv = minimist(process.argv.slice(2), {
  boolean: true
});
console.log(argv, argv.nocache);
const sevenZPath = tagsPath.replace("xml", "7z");

function onInsert(err: any, docs: any) {
  if (err) {
    console.log("onInsert", err);
  } else {
    console.info("%d potatoes were successfully stored.", docs.length);
  }
}

function extractAndInsert() {
  Seven.extractFull(sevenZPath, tempPath);
  fs.readFile(tagsPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    parseString(data, function(err, result) {
      console.debug(result.tags.row.map((el: any) => {
        return {
          name: el.TagName,
          stackoverflowMeta: {
            excerptPostId: el.ExcerptPostId,
            wikiPostId: el.WikiPostId,
            count: el.Count
          }
        };
      }));
      console.debug(result.tags.row[0]);
      // Skill.collection.insertMany(result.tags.row, onInsert)
      //  save to skills
    });
  });
}

if (!fs.existsSync(tagsPath) || argv.nocache) {
  download(
    "https://archive.org/download/stackexchange/stackoverflow.com-Tags.7z",
    sevenZPath,
    (message => {
      message && console.log("Download finished");
      extractAndInsert();
    })
  );
} else {
  extractAndInsert();
}
