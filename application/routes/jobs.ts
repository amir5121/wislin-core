import express from "express"
import Job from "../models/job"
import Skill from "../models/skill"

const router = express.Router()

router.get("/jobs/", async function (req, res, _) {
  res.send(await Job.find().populate("skills", "name").limit(10).exec())
})

router.get("/jobs-missing-skills/", async function (req, res, _) {
  res.send(
    await Job.where("skills")
      .equals(null)
      .populate("skills", "name")
      .limit(25)
      .exec()
  )
})

router.get("/:skillName/", async function (req, res, _) {
  const skill = await Skill.findOne({ name: req.params.skillName }).exec()
  if (skill) {
    const jobsGroupedBySkill = await Job.aggregate([
      { $match: { skills: skill._id } },
      { $unwind: "$skills" },
      { $group: { _id: "$skills", counts: { $sum: 1 } } },
      { $sort: { counts: -1 } },
    ])
      .limit(10)
      .exec()
    let skillMap: any = {}
    ;(
      await Skill.find(
        {
          _id: { $in: jobsGroupedBySkill.map((el: any) => el._id) },
        },
        "name"
      )
    ).map((el: any) => {
      skillMap[el._id] = el.name
    })

    res.send(
      jobsGroupedBySkill.map((el: any) => {
        el.name = skillMap[el._id]
        el.url = `http://localhost:8090/api/jobs/${el.name}/`
        // console.log(el)
        return el
      }) || {}
    )
  }
})

export default router
