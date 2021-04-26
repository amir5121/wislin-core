const express = require("express")
const router = express.Router()
const passport = require("../config/passport")

router.get("/self/", function (req, res, _) {
  console.log("AAAAAAAAAAAAAAAAAA", req.user)
  res.send(req.user)
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

module.exports = router
