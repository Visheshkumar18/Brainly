import mongoose, { Schema,Document, Types } from "mongoose";

export interface Usercontent extends Document{
    title:string,
    link:string,
    tags:[],
    type:string,
    userId:mongoose.Types.ObjectId
}

const contentSchema= new Schema<Usercontent>({
    title:{
        type:String,
        required:true,
        trim:true
    
    },
        link:{
            type:String,
            required:true,
            trim:true
        },
        tags:{
            type:[{type:mongoose.Types.ObjectId, ref:'Tag'}]
        },
         userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User", 
    
  },
  type:{
    type:String
  }
    
})
export const Content=mongoose.model("Content",contentSchema);