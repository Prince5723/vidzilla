import { user } from "../models/user.model.js"; 
import { uploadToCloudinary } from "../utils/cloudinary.js";

const registerUser = async (req, res) => {
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



    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImgLocalPath = req.files?.coverimg?.[0]?.path;
    
    if (!avatarLocalPath || !coverImgLocalPath) {
      return res.status(400).json({ msg: "Missing avatar or cover image" });
    }


    // Upload files to Cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverimg = await uploadToCloudinary(coverImgLocalPath);

    if (!avatar?.url || !coverimg?.url) {
      return res.status(500).json({ msg: "Unable to upload avatar and cover image" });
    }

    // Create and save the new user
    const newUser = new User({
      username,
      password, 
      email,
      fullname,
      avatarUrl: avatar.url,
      coverImgUrl: coverimg.url,
    });

    await newUser.save();

    return res.status(201).json({
      msg: "User registered successfully",
      data: {
        username,
        email,
        fullname,
        avatarUrl: avatar.url,
        coverImgUrl: coverimg.url,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ msg: "Server error. Unable to register user." });
  }
};

export { registerUser };
