import mongoose from "../config/mongoose";

export type UserDocument = mongoose.Document & {
  email: string
  firstName: string
  lastName: string
  googleId: string
  birthDate: Date
  createdAt: Date
  profilePicture: string
  fullName: () => string;
  // gravatar: (size: number) => string;
};


const userSchema = new mongoose.Schema<UserDocument>(
  {
    firstName: String,
    lastName: String,
    googleId: String,
    birthDate: Date,
    email: String,
    profilePicture: String,
  },
  {timestamps: true},
);

userSchema.methods.fullName = function () {
  return `${this.firstName} ${this.lastName}`
};

const User = mongoose.model<UserDocument>("User", userSchema)
export default User