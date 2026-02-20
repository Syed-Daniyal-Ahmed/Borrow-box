import { connectDB } from "@/lib/db";
import {User} from "@/models/user";

export async function getUserFromDb(email,hashpass) {
  await connectDB();
  
  return await User.findOne({email:email,password:hashpass}).lean();
}