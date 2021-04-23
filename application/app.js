const express = require("express")
const session = require("express-session")
const helmet = require("helmet")
const path = require("path")
const logger = require("morgan")
const passport = require("./config/passport")
const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")

const app = express()
app.use(helmet())
app.use(logger("dev"))

var sess = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {},
}

if (app.get("env") === "production") {
  app.set("trust proxy", 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())
app.use(passport.session())

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
