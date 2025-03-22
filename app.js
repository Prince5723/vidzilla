import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userroute } from "./src/route/user.router.js";

const app = express();


app.use(cors({ origin: process.env.cors_origin }));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//route
app.use("/user", userroute);

export { app }; 
