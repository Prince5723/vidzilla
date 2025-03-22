import { user } from "../models/user.model.js"
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
  
  
 
  } catch (error) {
    return res.status(500).json({
      msg : " server error, unable to create user"
    }
    )
  }
  

}

export { registerUser }