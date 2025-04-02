import { Router } from "express";
import { upload } from "../middlewares/multermodel.js";
import { registerUser , userlogin , logout ,refreshaccesstoken, changePassword ,getcurrentuser , updatedetails ,updateavatarORcoverimg} from "../controller/user.controller.js"
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

//getcurrentuser

userroute.post("/api/v6/getcurrentuser" , verifyjwt , getcurrentuser)

//update detaisls email and fullname

userroute.post("/api/v7/updatedetails" , updatedetails)

//update coverimg or avatar

userroute.post(
  "/api/v8/updateavatarORcoverimg",
  verifyjwt, 
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimg", maxCount: 1 }
  ]), 
  updateavatarORcoverimg
);




export { userroute };
