import mongoose from "../config/mongoose"

export interface SkillDocument extends mongoose.Document {
  name: string
  synonyms: string[]
  createdAt: Date
  updatedAt: Date
  stackoverflowMeta: {
    guid: number
    excerptPostId: Number
    wikiPostId: Number
    count: Number
  }
}

const skillSchema = new mongoose.Schema<SkillDocument>(
  {
    name: { type: String, index: true, unique: true, required: true },
    synonyms: [
      {
        type: String,
        unique: true,
        index: true,
      },
    ],
    stackoverflowMeta: {
      guid: Number,
      excerptPostId: Number,
      wikiPostId: Number,
      count: Number,
    },
  },
  { timestamps: true }
)

const Skill = mongoose.model<SkillDocument>("Skill", skillSchema)
export default Skill
