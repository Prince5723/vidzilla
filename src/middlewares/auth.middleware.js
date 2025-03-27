import { user } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyjwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized request" });
    }

    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if(!decodedToken){
      res.status(500).json({
        msg :"invalid decodedtoken"
      })
    }
   

    const findUser = await user.findById(decodedToken?._id).select("-password -refreshtoken"); // select everything accept

    if (!findUser) {
      return res.status(401).json({ msg: "Invalid access token" });
    }

    req.user = findUser; // finduser bhej diya mai request mai next jo user kare ka uss ko mil jaiga(user) khudse name diya you can give anything
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
