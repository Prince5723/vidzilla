import { user } from "../models/user.model.js"; 
import { uploadToCloudinary } from "../../index.js";

const registerUser = async (req, res) => {
  console.log(`hi bikash`);
  try {
    // Extract user details from the request body
    const { username, password, email, fullname } = req.body;

    // Validate required fields
    if (!username || !fullname || !password || !email) {
      return res.status(400).json({ msg: "Please provide all required details" });
    }

    // Check if the user already exists
    const existingUser = await user.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // Extract file paths from request
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImgLocalPath = req.files?.coverimg?.[0]?.path;

    if (!avatarLocalPath || !coverImgLocalPath) {
      return res.status(400).json({ msg: "Missing avatar or cover image" });
    }

    // Upload files to Cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverimg = await uploadToCloudinary(coverImgLocalPath);
    
    console.log('After upload');
    console.log("avatar", avatar);
    console.log("coverimg", coverimg);

    // Ensure images are uploaded successfully
    if (!avatar || !coverimg) {
      return res.status(500).json({ msg: "Unable to upload avatar and cover image" });
    }

    // Create and save the new user
    const newUser = new user({
      username,
      password, 
      email,
      fullname,
       avatar,  // Using the string URL directly
       coverimg,  // Using the string URL directly
    });

    await newUser.save();

    return res.status(201).json({
      msg: "User registered successfully",
      data: {
        username,
        email,
        fullname,
         avatar,  // No .url needed
        coverimg,  // No .url needed
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ msg: "Server error. Unable to register user." });
  }
};

export { registerUser };
