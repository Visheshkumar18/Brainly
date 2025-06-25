import mongoose, { Schema,Document, Types } from "mongoose";

export interface Usercontent extends Document{
    title:String,
    link:String,
    tags:[],
    userId:mongoose.Types.ObjectId
}

const contentSchema= new Schema<Usercontent>({
    title:{
        type:String,
    },
        link:{
            type:String
        },
        tags:{
            type:[{type:mongoose.Types.ObjectId, ref:'Tag'}]
        },
         userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User", 
    
  }
    
})
export const Content=mongoose.model("Content",contentSchema);