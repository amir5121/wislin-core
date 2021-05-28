import download from "../utils/download"

download(
  "https://stackoverflow.com/jobs/feed",
  sevenZPath,
  (message => {
    message && console.log("Download finished")
    extractAndInsert()
  })
)