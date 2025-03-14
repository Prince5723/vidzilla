import mongoose from "mongoose";

const connectdb = async () => {
  try {
    console.log("MongoDB URL:", process.env.mongo_url);
    await mongoose.connect(process.env.mongo_url);
    console.log(" Connected to DB");
  } catch (error) {
    console.error(" Unable to connect to DB", error);
    process.exit(1);
  }
};

export { connectdb };
