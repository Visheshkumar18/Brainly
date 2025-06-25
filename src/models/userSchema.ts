import { Schema,Document } from "mongoose";
import mongoose from "mongoose";
export interface Iuser extends Document{
    userName:string,
    password:string
}

const UserSchema=new Schema<Iuser>({
    userName:{
        type:String,
        required:true,
        unique:true
        
    },
    password:{
        type:String,
        required:true,
      
    }

})
export const User=mongoose.model<Iuser>("User",UserSchema);