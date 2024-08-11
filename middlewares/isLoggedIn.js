import userModel from '../models/user_model.js'
import "dotenv/config"
import jwt from "jsonwebtoken"
import appErr from "../utils/appErr.js";


export const isLoggedIn = async (req, res, next) => {

  const authHeader = req.headers.authorization;
    
  if (!authHeader) return next(appErr('No token provided',401))

  const token = authHeader.split(' ')[1];
      
  if (!token) return next(appErr('Unauthorized',401)) 
 
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById({_id:payload.id})
    
    // console.log(user);
    
    if (!user) return next(appErr('Unauthorized',401))

    req.user = user;

    next();

  } catch (e) {
    return next(appErr('Tocken is expired or incorrect',498))
  }
  }