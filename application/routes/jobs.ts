import express from "express"
import Job from "../models/job"

const router = express.Router()

router.get("/jobs/", async function (req, res, _) {
  res.send((await Job.find({}).limit(100).exec()) || {})
})

export default router
