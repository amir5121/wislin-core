const express = require("express")
const router = express.Router()

router.get("/", function (req, res, _) {
  console.log(req.user)
  res.send(req.user)
})

export default router
