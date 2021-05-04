import express, {NextFunction, Response} from "express";

const router = express.Router()

router.get("/", function (req, res: Response, _: NextFunction) {
  console.log(req.user)
  res.send(req.user)
})

export default router
