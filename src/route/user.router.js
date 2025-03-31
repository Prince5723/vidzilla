import { Router } from "express";
import { upload } from "../middlewares/multermodel.js";
import { registerUser , userlogin , logout ,refreshaccesstoken, changePassword } from "../controller/user.controller.js"
import { verifyjwt } from "../middlewares/auth.middleware.js";

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

//logout user
userroute.post("/api/v3/logout" ,verifyjwt, logout);


//refreshtoken
userroute.post("/api/v4/refresh-token" , refreshaccesstoken);

//changepassword

userroute.post("/api/v5/changepassword", verifyjwt , changePassword)



export { userroute };
