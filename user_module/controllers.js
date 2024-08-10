import appErr from "../utils/appErr.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import appRes from "../utils/appRes.js"
import userModel from '../models/user_model.js'


export const fetchUsers = async(req, res,next)=>{ 
    
    try { 
        const users = await userModel.find({})

        if (users.length <1) return appRes(res,200,'',`${users.length} user found!`,{users})
        
        // user.password = undefined
        appRes(res,200,'',`${users.length} users found!`,{users})
    } catch (e) {
        return next(appErr(e.message,500))
    }
}

export const signin = async(req,res, next)=>{ 
    const {email,password} = req.body
    if(!email || !password) return next(appErr('email and password are required'),400) 
    try {
        const user = await userModel.findOne({email})

        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch)return next(appErr('Invalid Credentials',401)) 
        
        const tocken = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn: '1h'}) 

        appRes(res,200,'','Login success!',{tocken})
    } catch (e) {
        return next(appErr(e.message,500))
    } 

}
