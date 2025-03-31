import mongoose from "mongoose";

const subscriptionschema = new mongoose.Schema(
  {
    subscriber: { // Who is subscribing
      type: mongoose.Schema.Types.ObjectId,  
      ref: "user",  
    },
    channel: { // Which user is being subscribed to
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user",  
    },
  },
  { timestamps: true } 
);

export const subscription = mongoose.model("subscription", subscriptionschema);
