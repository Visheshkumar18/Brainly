import mongoose, { model, Schema } from "mongoose";
import { User } from "./userSchema";
const LinkSchema=new Schema({
    hash:String,
    userId:{type:mongoose.Types.ObjectId,ref:"User",required:true,unique:true},
   

})
export const Links=model("Links",LinkSchema);