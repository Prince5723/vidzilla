import { Router } from "express";
import { upload } from "../middlewares/multermodel.js";
import { registerUser , userlogin } from "../controller/user.controller.js"

const userroute = Router();

//register user route
userroute.post(
  "/api/v1/registerUser",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimg", maxCount: 1 }
  ]),
  registerUser
);

//loginuser route
userroute.post("/api/v2/userlogin", userlogin);





export { userroute };
