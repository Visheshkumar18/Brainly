import express, { json, Request, Response } from "express";
import { User } from "./models/userSchema";
import   {Content}  from "./models/contentSchema";
import ConnectDB from "./config/database";
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import userAuth from "./Middleware/authMiddleware";
import{PORT} from "./config"
import { Links } from "./models/LinkSchema";
import { random } from "./utils/Utils";
import cors from 'cors';

const app=express();
app.use(json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true               
}));

app.post("/signup",async (req:Request,res:Response):Promise<void>=>{
    try{
        const{userName,password}=req.body;
        if(!userName || !password){
            res.status(403).send("Invalid userName and Password");
            return ;
            
        }
        const hashPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            userName:userName,
            password:hashPassword
        })
        user.save();
        res.status(200).json({message:"User Signup successfully!"});


    }
    catch(err){
        res.status(403).json({message:err});
    }
})
app.post("/signin",async (req:Request,res:Response):Promise<void>=>{
    try{
        const{userName,password}=req.body;
        if(!userName || !password){
            res.status(403).send("Invalid userName and Password");
            return ;
            
        }
        const isValidUser=await User.findOne({userName});
        if(!isValidUser){
            throw new Error("Something went wrong!");
            
        }
        const isValidPassword=await bcrypt.compare(password,isValidUser.password);
        if(!isValidPassword){
            throw new Error("something went wrong!");
        }
        const token = jwt.sign({id:isValidUser._id},"$!123!$");
        res.cookie("token",token);
        res.json({message:`${userName} Signin successfully!`});


    }
    catch(err){
        res.status(403).json({message:( err as  Error).message});
    }
})

app.post("/content",userAuth,async (req:Request,res:Response):Promise<void>=>{
    if (!req.user || !req.user._id) {
  res.status(401).json({ message: "Unauthorized" });
  return;
}

    const link=req.body.link;
    const type=req.body.type;
    const title=req.body.title
    await Content.create({
        link:link,
        type:type,
        tags:[],
        title:title,
        userId:req.user.id
    })
    res.json({message:"Content is Saved "})
})

app.get("/content",userAuth,async(req,res):Promise<void>=>{
  try{
      const userId=req.user._id;
    const content=await Content.find({userId});
     res.json(content);
     return;
  }
  catch(err){
    res.json({message:(err as Error).message});
    return;
  }

})
app.delete("/delete/:id",userAuth,async(req,res)=>{
    const contentID=req.params.id;
    const userID=req.user._id;
    await Content.deleteOne({
        _id:contentID,
        userId:userID
    })
    res.json({message:"Deleted"});
})
app.post("/share", userAuth, async (req, res) => {
  const { share } = req.body;

    if (share) {
    const Linkhash = random(10);
    await Links.updateOne(
      { userId: req.user._id },
      { $set: { hash: Linkhash } },
      { upsert: true }
    );
    res.json( Linkhash );
  } else {
    await Links.deleteOne({ userId: req.user._id });
    res.json({ message: "Removed link" });
  }
});

app.get("/brain/:shareLink",userAuth,async(req, res)=>{
    const link=req.params.shareLink;
  const isValidLink=  await Links.findOne({hash:link});
    if(!isValidLink){
        res.status(411).json({message:"Invalid input type"});
    }
    else{
       const user = await User.findOne({_id:isValidLink.userId}); 
       if(!user){
        res.json({message:"User is not exist"});
       }
       const userContent=await Content.find({userId:isValidLink.userId});
       res.json({username:user?.userName,
        content:userContent
       })
    }
})








ConnectDB().then(()=>{
    console.log("Database connection is Established!!")
    app.listen(PORT,()=>{console.log("server is listen on port 3000")})
})
