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
  if (skill) {
    // res.send(
    //   (await Job.find({
    //     $expr: {
    //       $and: [
    //         {
    //           skills: skill._id,
    //         },
    //         // { "$eq": ["$name", "development"] },
    //         // { "$gte": [{ "$size": "$followers" }, followers_count ]}
    //       ],
    //     },
    //   })
    //     .limit(10)
    //     .exec()) || {}
    // )
    const jobsGroupedBySkill = await Job.aggregate([
      { $match: { skills: skill._id } },
      { $unwind: "$skills" },
      { $group: { _id: "$skills", counts: { $sum: 1 } } },
      { $sort: { counts: -1 } },
    ])
      // .limit(10)
      .exec()
    let skilMap: any = {}
    await Skill.find(
      {
        _id: { $in: jobsGroupedBySkill.map((el: any) => el._id) },
      },
      "name"
    ).map((el: any) => (skilMap[el._id] = el.name))
    console.log("OIPOPOPO", skilMap)

    res.send(
      jobsGroupedBySkill.map((el: any) => {
        el.name = skilMap[el._id]
        // console.log(el)
        return el
      }) || {}
    )
  }
})

export default router
