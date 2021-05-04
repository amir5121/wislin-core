import express from "express"
import passport from "../config/passport"

const router = express.Router()

router.get("/self/", function (req, res, _) {
  console.log("AAAAAAAAAAAAAAAAAA", req.user, req.user?.fullName(), req.user?.createdAt)
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