import express from "express"
import {Request} from "express";
// import passport from "../config/passport"
import passport from "../config/passport"

const router = express.Router()

router.get("/self/", function (req: Request, res, _) {
  console.log("AAAAAAAAAAAAAAAAAA", req.user)
  res.send(req.user || {})
})

router.get(
  "/auth/google/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
)

router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    res.send(req.user)
  }
)

router.get("/auth/logout", (req, res) => {
  req.logout()
  res.send(req.user)
})

export default router