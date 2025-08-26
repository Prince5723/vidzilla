import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userroute } from "./src/route/user.router.js";
import { videoroute } from "./src/route/video.router.js";

const app = express();


app.use(cors({ origin: process.env.cors_origin }));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));  
app.use(express.static("public"));

//route
app.use("/user", userroute);
app.use("/video", videoroute);

export { app }; 
