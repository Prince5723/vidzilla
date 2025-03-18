import { response } from "express";

const registeruser = (req, res) => {
  try {
    //extraction of details from body
    const{ username , password , email , fullname} = req.body
    if (!username || !fullname || !password || !email) {
      return res.json({
        msg: "Enter clear details"
      });
    }
    return res.status(200).json({
      msg: "User registered successfully",
      data: req.body
    });
  } catch (error) {
    console.log(error)
     return res.status(500).json({
      msg : "unable to register user"
    })
  }
 
};

export { registeruser }
