import mongoose from "../config/mongoose";

export type SkillDocument = mongoose.Document & {
  name: string
  synonyms: string[]
  createdAt: Date
  updatedAt: Date
};

const skillSchema = new mongoose.Schema<SkillDocument>(
  {
    name: String,
    synonyms: [{
      type: String
    }]
  },
  {timestamps: true}
);

const Skill = mongoose.model<SkillDocument>("Skill", skillSchema)
export default Skill