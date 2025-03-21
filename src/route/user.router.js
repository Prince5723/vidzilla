import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import { upload } from "../middlewares/multermodel.js";

const userroute = Router();


userroute.post(
  "/api/v1/register", 
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimg", maxCount: 1 },
  ]), 
  registerUser
);

export { userroute };
