import express from "express"
import Job from "../models/job"

const router = express.Router()

router.get("/jobs/", async function (req, res, _) {
  res.send(
    (await Job.find({}).populate("skills", "name -_id").limit(10).exec()) || {}
  )
})

export default router
