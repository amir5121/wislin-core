var express = require("express")
var router = express.Router()
var passport = require("../config/passport")

// router.get("/", function (req, res, next) {
//   res.send("respond with a resource")
// })

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
    res.send("you reached the redirect URI")
  }
)

router.get("/auth/logout", (req, res) => {
  req.logout()
  res.send(req.user)
})

module.exports = router
