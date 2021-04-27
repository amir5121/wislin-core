const express = require("express")
const session = require("express-session")
const helmet = require("helmet")
const path = require("path")
const logger = require("morgan")
const passport = require("./config/passport")
const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")
const cors = require('cors')

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
} else {
  app.use(cors({
    // origin: 'http://localhost:3000',
    credentials: true,
    origin: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }))
}

app.use(session(sess))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/api/user", usersRouter)

// error handler
app.use(function (err, req, res, _) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  console.log(res.locals.message, res.locals.error)
  // res.render("error")
})

module.exports = app
