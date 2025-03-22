import { Router } from "express";
import { upload } from "../middlewares/multermodel.js";
import { registerUser } from "../controller/user.controller.js"

const userroute = Router();

userroute.post(
  "/api/v1/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimg", maxCount: 1 }
  ]),
  registerUser
);


export { userroute };
