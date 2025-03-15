import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import aggregatePaginate from "mongoose-aggregate-paginate/lib/mongoose-aggregate-paginate";

const videoschema = new mongoose.Schema({
  videotumbnail:{
    required : true,
    type : String
  },
  videofile :{
    required : true,
    type : String
  },
  videoowner :{
    type : Schema.Types.ObjectId,
    ref : "user"
  },
  title :{
    required : true,
    type : String
  },
  description :{
    type : String,
    required : true
  },
  view :{
    type : Number,
    default : 0,
  },
  ispublished :{
    type : boolean,
    default : true
  }
},{
  timestamps : true,
})

videoSchema.plugin(mongooseAggregatePaginate); //imp when you have large file to load you cant load whole db some selected one to show on page so you use plugin(additional function)

export const video = mongoose.model("video" , videoschema)