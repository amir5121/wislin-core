import express from "express"
import Skill from "../models/skill"

const router = express.Router()

router.get("/skills/", async function (req, res, _) {
  res.send((await Skill.find({}).limit(100).exec()) || {})
})

export default router
