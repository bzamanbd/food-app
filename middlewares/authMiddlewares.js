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
    // eslint-disable-next-line no-undef
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById({_id:payload.id})
    
    // console.log(user);
    
    if (!user) return next(appErr('Unauthorized',401))

    req.user = user;

    next();

  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return next(appErr('Tocken is expired or incorrect',498))
  }
  }

  export const isAdmin = async (req, res, next) => {
    try {
      const role = req.user.role    
      if (role !== 'admin')return next(appErr('Unauthorized access',401))
      next(); 
    } catch (e) {
      return next(appErr(e.message,500))
    }
  }