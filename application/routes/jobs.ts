import express from "express"
import Job from "../models/job"
import Skill from "../models/skill"

const router = express.Router()

router.get("/jobs/", async function (req, res, _) {
  res.send(
    (await Job.find({}).populate("skills", "name").limit(10).exec()) || {}
  )
})

router.get("/django/", async function (req, res, _) {
  const skill = await Skill.findOne({ name: "django" }).exec()
  if (skill)
    res.send(
      (await Job.find({
        skills: skill._id,
      })
        .limit(10)
        .exec()) || {}
    )
})

export default router
