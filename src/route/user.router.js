import { Router } from "express";
import { registeruser } from "../controller/user.controller.js";
import { upload } from "../middlewares/multermodel.js";

const userroute = Router();

//userroute.route("/registeruser").post(registeruser) otherwaytodo
userroute.post("/api1/registeruser", upload.fields(   //upload here is middleware iss rout per jane time le do chezz lena
  [
    {
      name : "avatar",
      maxcount : 1,
    },{
      name : "coverimg",
      maxcount : 1,
    }
  ]
) , registeruser)

export { userroute };
