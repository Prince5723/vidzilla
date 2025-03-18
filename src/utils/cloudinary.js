import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadToCloudinary = async (uploadFilePath) => {
  try {
    if (!uploadFilePath) return null;

    const response = await cloudinary.uploader.upload(uploadFilePath, {
      resource_type: "auto"
    });

    console.log("File uploaded successfully:", response.url);
    return response.url; 
  } catch (error) {
    console.error("Upload error:", error);
    fs.unlinkSync(uploadFilePath); 
    return null;
  }
};

export { uploadToCloudinary };
