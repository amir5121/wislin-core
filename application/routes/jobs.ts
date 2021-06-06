import express from "express"
import Job from "../models/job"

const router = express.Router()

router.get("/jobs/", async function (req, res, _) {
  res.send(
    (await Job.find({}).populate("skills", "name -_id").limit(10).exec()) || {}
  )
})
router.get("/django/", async function (req, res, _) {
  res.send(
    (await Job.aggregate([
      {
        $lookup: {
          from: "skills",
          // localField: "skills",
          // foreignField: "_id",
          pipeline: [
            {
              $match: {
                $expr: {
                  // _id: "60bd222ab048b56051b623ac",
                  name: "django",
                  // $and: [
                  //   { $eq: ["$_id", "$skills"] },
                  // ],
                },
              },
            },
          ],
          as: "enrollee_info",
        },
      },
    ])
      .limit(10)
      .exec()) || {}
  )
})

export default router
