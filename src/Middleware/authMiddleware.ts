import { Request, Response, NextFunction } from "express";
import { User } from "../models/userSchema";
import jwt, { JwtPayload } from "jsonwebtoken";


const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Unauthorized Access");
    }
    console.log("Authorization...")
    const decodedObj = jwt.verify(token, "$!123!$") as JwtPayload;
    const { id } = decodedObj;

    const LoggedIN = await User.findById(id);
 
    if (!LoggedIN) {
      throw new Error("User not found");
    }

    req.user = LoggedIN; 
    next();
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
};

export default userAuth;
