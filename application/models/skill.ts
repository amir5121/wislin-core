import mongoose from "../config/mongoose"

export interface SkillDocument extends mongoose.Document {
  name: string
  synonyms: string[]
  createdAt: Date
  updatedAt: Date
  stackoverflowMeta: {
    guid: number
    excerpt: string
    wiki: string
    count: Number
  }
}

const skillSchema = new mongoose.Schema<SkillDocument>(
  {
    name: {
      type: String,
      index: true,
      unique: true,
      required: true,
      trim: true,
    },
    synonyms: {
      type: [String],
      trim: true,
    },
    stackoverflowMeta: {
      guid: Number,
      excerpt: String,
      wiki: String,
      count: Number,
    },
  },
  { timestamps: true }
)

const Skill = mongoose.model<SkillDocument>("Skill", skillSchema)
export default Skill
