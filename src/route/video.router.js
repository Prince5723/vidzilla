import { Router } from "express";
import { upload } from "../middlewares/multermodel.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { uploadVideo, getAllVideos } from "../controller/video.controller.js";

const videoroute = Router();

// upload video (protected)
videoroute.post(
  "/api/v1/upload",
  verifyjwt,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  uploadVideo
);

// list videos (public)
videoroute.get("/api/v1/list", getAllVideos);

export { videoroute };


