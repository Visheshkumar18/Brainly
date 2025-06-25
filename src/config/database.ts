import mongoose from "mongoose";
const ConnectDB= async ()=>{
    await mongoose.connect("mongodb+srv://vk2256087:vishesh123@cluster0.uwsaw7m.mongodb.net/secondBrain");
}
export default ConnectDB;