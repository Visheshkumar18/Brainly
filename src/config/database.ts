import {MONGO_URI,PORT} from "../config";
import mongoose from "mongoose";
const ConnectDB= async ()=>{
    await mongoose.connect(MONGO_URI);
}
export default ConnectDB;