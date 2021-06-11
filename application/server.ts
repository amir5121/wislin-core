import errorHandler from "errorhandler"
import app from "./app"

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === "development") {
  app.use(errorHandler())
}

/**
 * Start Express server.
 */
const port = process.env.PORT || 8090
const server = app.listen(port, () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    port,
    app.get("env")
  )
  console.log("  Press CTRL-C to stop\n")
})

export default server
