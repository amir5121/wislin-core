import {UserDocument} from "../models/user";

declare module "express" {
  export interface Request {
    user: UserDocument
  }
}
