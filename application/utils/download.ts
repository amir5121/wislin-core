import fs from "fs"
import path from "path"
import httpRequest from "./http-request"

async function download(url: string, dest: string) {
  console.log("download", url, dest)
  const response = await httpRequest(url)
  if (response.res.statusCode === 302 && response.res.headers.location) {
    console.debug("following redirect...")
    await download(response.res.headers.location, dest)
    return
  } else if (response.res.statusCode !== 200) {
    throw "failed with status code " + response.res.statusCode
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  console.log("Writing buffer to disk")
  fs.writeFileSync(dest, Buffer.concat(response.body))
}

export default download
