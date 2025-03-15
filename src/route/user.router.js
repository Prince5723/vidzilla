import { Router } from "express";
import { registeruser } from "../controller/user.controller.js";

const userroute = Router();

//userroute.route("/registeruser").post(registeruser) otherwaytodo
userroute.post("/api1/registeruser" , registeruser)

export { userroute };
