import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log("Cloud Name:", process.env.CLOUD_NAME); // Debugging  

export default {
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
};
