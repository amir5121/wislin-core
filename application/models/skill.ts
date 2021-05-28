import mongoose from "../config/mongoose"

export interface SkillDocument extends mongoose.Document {
  name: string
  synonyms: string[]
  createdAt: Date
  updatedAt: Date
  stackoverflowMeta: {
    excerptPostId: Number,
    wikiPostId: Number,
    count: Number,
  }
}

const skillSchema = new mongoose.Schema<SkillDocument>(
  {
    name: String,
    synonyms: [{
      type: String
    }],
    stackoverflowMeta: {
      excerptPostId: Number,
      wikiPostId: Number,
      count: Number
    }
  },
  { timestamps: true }
)

const Skill = mongoose.model<SkillDocument>("Skill", skillSchema)
export default Skill