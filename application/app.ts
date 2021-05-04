import express from "express"
import session from "express-session"
import helmet from "helmet"
import path from "path"
import logger from "morgan"
import passport from "passport"
import indexRouter from "./routes"
import usersRouter from "./routes/users"
import cors from 'cors'
import redis from 'redis'
import connectRedis from 'connect-redis'

const app = express()
app.use(helmet())
app.use(logger("dev"))

const RedisStore = connectRedis(session)

let sess = {
  secret: process.env.SESSION_SECRET || "pickasecret",
  store: new RedisStore({client: redis.createClient()}),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  },
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
// app.use(function (err, req: , res, _) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get("env") === "development" ? err : {}
//
//   // render the error page
//   res.status(err.status || 500)
//   console.log(res.locals.message, res.locals.error)
//   // res.render("error")
// })

export default app
