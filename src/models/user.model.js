import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import z from "zod";

const userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true, // For searching
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  coverimg: {
    type: String,
  },
  watchhistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "video",
    },
  ],
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshtoken: {
    type: String,
  },
}, {
  timestamps: true,
});

// Password hashing before saving
userschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userschema.methods.checkpassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userschema.methods.accesstoken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXP,
    }
  );
};

// Generate Refresh Token (Fixed naming issue)
userschema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXP,
    }
  );
};

// Zod validation schema
export const zodvalidationschema = z.object({
  password: z.string().min(6, "Min length should be 6"),
  email: z.string().email(),
});

// Export Mongoose Model
export const user = mongoose.model("User", userschema);
