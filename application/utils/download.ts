import fs from "fs";
import https from "https";

function download(url: string, dest: string, cb: (message?: string) => void) {
  const file = fs.createWriteStream(dest);
  const request = https.get(url, (response) => {
      // check if response is success
      if (response.statusCode === 302 && response.headers.location) {
        console.debug("following redirect...")
        return download(response.headers.location, dest, cb)
      } else if (response.statusCode !== 200) {
        return cb('Response status was ' + response.statusCode);
      }

      response.pipe(file);
    }
  )

  file.on('finish', () => {
    file.close()
    cb()
  });

  request.on('error', (err) => {
    fs.unlink(dest, () => {
    });
    return cb(err.message);
  });
}

export default download