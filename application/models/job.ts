import mongoose from "../config/mongoose"
import { JOB_TYPES } from "../config/constants"
import { SkillDocument } from "./skill"

export interface JobSchema {
  guid: string
  link: string
  type: "stackoverflow" | "indeed" | "linkedin"
  author: string
  skills: SkillDocument[]
  title: string
  description: string
  publicationDate: Date
  referenceUpdatedDate: Date
  location: string
  salaryMinValue: number
  salaryMaxValue: number
  currency: string
}
export interface JobDocument extends mongoose.Document, JobSchema {
  createdAt: Date
  updatedAt: Date
}

const jobSchema = new mongoose.Schema<JobDocument>(
  {
    guid: String,
    link: String,
    type: { type: String, enum: JOB_TYPES },
    author: String,
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    title: String,
    description: String,
    publicationDate: Date,
    referenceUpdatedDate: Date,
    location: String,
    salaryMinValue: Number,
    salaryMaxValue: Number,
    currency: String,
  },
  { timestamps: true }
)

const Job = mongoose.model<JobDocument>("Job", jobSchema)
export default Job
