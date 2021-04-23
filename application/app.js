const express = require("express")
const path = require("path")
const logger = require("morgan")
const passport = require("./config/auth")
const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())
// app.use(passport.session())

app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
