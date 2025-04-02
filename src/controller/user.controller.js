import { configDotenv } from "dotenv"
import { user} from "../models/user.model.js"
import  jwt  from "jsonwebtoken";
import { uploadtocloudinay } from "../utils/cloudinary.js"




const registerUser = async(req ,res)=>{

  try {
  
    //taking user details
  const{ username , email , fullname , password } = req.body

    //input validation
  if(!username || !email || !fullname || !password){
    return res.status(400).json({
      msg : " not fullfilled user details, eneter full details"
    })
  }

  //find user in db
  const finduser = await user.findOne({
    $or : [{email},{username}]
  })


  //if user found
  if(finduser)
  {
    return res.status(409).json({
      msg : " user already exist please login"
    })
  }

  //if user not found then take img and avatar

  const getavatar = req.files?.avatar?.[0]?.path;  
  const getcoverimg = req.files?.coverimg?.[0]?.path;

  // console.log(avatar)
  // console.log(coverimg)

  // if avatar and coverimg missing
  if(!getavatar || !getcoverimg)
  {
    return res.status(400).json({
      msg : " missing avatar or coverimg"
    })
  }

  const avatar = await uploadtocloudinay(getavatar);
  const coverimg = await uploadtocloudinay(getcoverimg);
  
  if (!avatar || !coverimg) {
    return res.status(500).json({
      msg: "Unable to upload coverimg or avatar to Cloudinary",
    });
  }

  //create new user
  const newuser = new user({
    username,
    email,
    fullname,
    password,
    avatar,  
    coverimg, 
  });
  
  await newuser.save();

  return res.status(200).json({
    msg: "User created successfully",
    data: {
      username,
      email,
      fullname,
      avatar,  
      coverimg,
    },
  });
  

  /// ALL DONE WITH REGISTER USER , NOW TIME FOR LOGIN

 
  } catch (error) {
    return res.status(500).json({
      msg : " server error, unable to create user"
    }
    )
  }
  

};


const userlogin = async (req, res) => {
  try {

    // Take username, password, and email from request body
    const { username, password, email } = req.body;

    // Check if required info is provided
    if (!(username || email || password)) {
      return res.status(400).json({
        msg: "Your data is missing",
      });
    }

    // Check if user exists
    const findUser = await user.findOne({
      $or: [{ username }, { email }],
    });

    // If user is not found
    if (!findUser) {
      return res.status(404).json({
        msg: "User not found. Please register",
      });
    }

    // Compare password
    const isPasswordValid = await findUser.checkpassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        msg: "Incorrect password",
      });
    }

    // Generate access and refresh tokens
    const refreshToken = findUser.generateRefreshToken();
    const accessToken = findUser.generateAccesstoken();

    // Save refresh token in the database
    findUser.refreshtoken = refreshToken;
    await findUser.save({ validateBeforeSave: false });

    //console.log(findUser)

    //can be altered only through backend
    const options = {
      httponly : true,
      secure : true
    }
    // Set cookies and return response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        msg: "Login successful",
        user: {
          username: findUser.username,
          email: findUser.email,
          fullname : findUser.fullname,
          avatar : findUser.avatar,
          coverimg : findUser.coverimg,
          accessToken,
          refreshToken,
        },
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server error, unable to process request",
    });
  }
};


const logout = async (req, res) => {
  try {
    await user.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshtoken: undefined,
        },
      }
    );

    const options = {
      httponly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options) 
      .clearCookie("refreshToken", options) 
      .json({
        msg: "User logout",
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Unable to logout, please try again",
    });
  }
};


const refreshaccesstoken = async (req, res) => {
  try {
    const incomingrefreshtoken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingrefreshtoken) {
      return res.status(401).json({
        msg: "unauthorized access",
      });
    }

    const decodedrefreshtoken = jwt.verify(incomingrefreshtoken, process.env.refresh_token_secret);

    const user = await user.findById(decodedrefreshtoken?._id);

    if (!user) {
      return res.status(500).json({
        msg: "invalid refresh token",
      });
    }

    if (incomingrefreshtoken !== user.refreshToken) {
      return res.status(500).json({
        msg: "refresh token is expired or verification failed",
      });
    }

    // Generate new tokens
    const newrefreshToken = user.generateRefreshToken();
    const newaccessToken = user.generateAccesstoken();

    // Save new refresh token to DB
    user.refreshToken = newrefreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("refreshToken", newrefreshToken, options)
      .cookie("accesstoken", newaccessToken, options)
      .json({
        msg: "session renewed",
        user: {
          username: user.username,
          email: user.email,
          fullname: user.fullname,
          avatar: user.avatar,
          coverimg: user.coverimg,
          newaccessToken,
          newrefreshToken,
        },
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "invalid request",
    });
  }
};


const changePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword, confirmpassword } = req.body;

    
    const userInstance = await user.findById(req.user._id);
    if (!userInstance) {
      return res.status(404).json({ msg: "User not found" });
    }

    
    if (newpassword !== confirmpassword) {
      return res.status(400).json({ msg: "New password and confirm password do not match" });
    }

    
    const correctPassword = await userInstance.checkpassword(oldpassword);
    if (!correctPassword) {
      return res.status(401).json({ msg: "Password verification failed" });
    }

    
    userInstance.password = newpassword;

    await userInstance.save({ validateBeforeSave: false });

    return res.status(200).json({ msg: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500)
    .json({ msg: "Unable to change password" });
  }
};


const getcurrentuser = async (req, res) => {
  try {
    return res.status(200).json({
      data: req.user, 
      message: "Current user fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const updatedetails = async (req, res) => {
  try {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
      return res.status(400).json({
        msg: "Please enter all required details",
      });
    }

    const updatedinfo = await user.findByIdAndUpdate(
      req.user?._id, // Find the user by ID
      {
        $set: {
          fullname,
          email,
        },
      }, // Update query
      { new: true } // Return the updated document without password
    ).select("-password");

    if (!updatedinfo) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    return res.status(200).json({
      user: updatedinfo, 
      msg: "Account details updated successfully",
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({
      msg: "Unable to update details",
    });
  }
};


const updateavatarORcoverimg = async (req, res) => {
  try {
    const getcoverimg = req.files?.coverimg?.[0]?.path;
    const getavatar = req.files?.avatar?.[0]?.path;

    if (!getavatar && !getcoverimg) {
      return res.status(400).json({
        msg: "Missing avatar or cover image",
      });
    }

    const avatar =  await uploadtocloudinay(getavatar) 
    const coverimg = await uploadtocloudinay(getcoverimg) 

    if ((avatar && !avatar.url) || (coverimg && !coverimg.url)) {
      return res.status(402).json({
        msg: "Unable to upload to Cloudinary",
      });
    }


    const updatedUser = await user.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar.url ,
          coverimg: coverimg.url 
        },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      data: updatedUser,
      msg: "Cover image / avatar updated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Unable to update",
    });
  }
};

export { registerUser, userlogin , logout , refreshaccesstoken , changePassword , getcurrentuser,updatedetails,updateavatarORcoverimg};
