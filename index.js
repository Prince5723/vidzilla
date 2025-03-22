
import {app} from "./app.js"
import dotenv from "dotenv";
import { connectdb } from "./src/dbconnection/dbindex.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: "./.env" }); 
console.log(process.env.API_KEY)

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

    console.log("File uploaded successfully:", response.secure_url);
    console.log(response)
    return response.secure_url; 
  } catch (error) {
    console.error("Upload error:", error);
    fs.unlinkSync(uploadFilePath); 
    return null;
  }
};

export { uploadToCloudinary };



connectdb()
.then(()=>{
  app.listen(3000, () => {
    console.log("Your application is running on port 3000");
  })
})
.catch((err) =>{
  console.log(`not connected mongodb`)
})
