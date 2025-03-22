import { v2 as cloudinary} from "cloudinary"
import fs from "fs"
import  config  from "./config.js"

// console.log(process.env.CLOUD_NAME)
// console.log(process.env.API_KEY)
// console.log(process.env.API_SECRET)
cloudinary.config({
  cloud_name: config.cloudName, 
  api_key: config.apiKey,
  api_secret: config.apiSecret,
});

const uploadtocloudinay = async (localfilepath)=> {
  try {
    if(!localfilepath) return null;
    const response = await cloudinary.uploader.upload(localfilepath);
    console.log(`upload successfull The link is: ${response.secure_url}`)
    return response.secure_url;

    
  } catch (error) {
    console.error("Upload error:", error);
    fs.unlinkSync(localfilepath)
    return console.log(`unable to link file`)
  }
  
}

export {uploadtocloudinay}