import https from "https"

export default function httpRequest(
  reqUrl: string,
  method: "GET" | "POST" | "PATCH" = "GET",
  postData: any = null
): Promise<{ res: any; body: any }> {
  return new Promise(function (resolve, reject) {
    const req = https.request(
      {
        host: new URL(reqUrl).host,
        port: 443,
        method: method,
        path: new URL(reqUrl).pathname,
      },
      function (res) {
        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 400) {
          return reject(new Error("statusCode=" + res.statusCode))
        }
        let body: any[] = []
        console.log("httpRequest downloading")
        res.on("data", function (chunk) {
          body.length % 50 === 0 && process.stdout.write(".")
          body.push(chunk)
        })
        res.on("end", function () {
          try {
            if (res.headers["content-type"] === "application/json") {
              body = JSON.parse(Buffer.concat(body).toString())
            }
          } catch (e) {
            reject(e)
          }
          resolve({ res, body })
        })
      }
    )
    req.on("error", function (err) {
      reject(err)
    })
    if (postData) {
      req.write(postData)
    }
    req.end()
  })
}
