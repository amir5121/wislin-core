import mongoose from "../config/mongoose"
import { JOB_TYPES } from "../config/constants"
import { SkillDocument } from "./skill"

export interface JobDocument extends mongoose.Document {
  guid: string
  link: string
  type: "stackoverflow" | "indeed"
  author: string
  skills: SkillDocument[]
  title: string
  description: string
  publicationDate: Date
  referenceUpdatedDate: Date
  location: string
  createdAt: Date
  updatedAt: Date
}

const jobSchema = new mongoose.Schema<JobDocument>(
  {
    guid: String,
    link: String,
    type: { type: String, enum: JOB_TYPES },
    author: String,
    skills:[
      {type: mongoose.Schema.Types.ObjectId, ref: 'SKill'}
    ],
    title: String,
    description: String,
    publicationDate: Date,
    referenceUpdatedDate: Date,
    location: String,
  },
  { timestamps: true }
)

const Job = mongoose.model<JobDocument>("Job", jobSchema)
export default Job