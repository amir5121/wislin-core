import { UserDocument } from "../models/user"

declare module "express-serve-static-core" {
  interface Request {
    user: UserDocument
  }
}
