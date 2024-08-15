import appErr from "../utils/appErr.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import appRes from "../utils/appRes.js"
import userModel from '../models/user_model.js'
import adminEmails from "../utils/adminEmails.js"
import isValidEmail from '../utils/isValidEmail.js';


export const signup = async(req, res,next)=>{ 
    const {userName,email,password,address,phone,question,answer,role} = req.body
    
    if(!userName || !email || !password || !phone || !question || !answer) return next(appErr('name,email,password,phone,question and answer are required'),400) 
    
    if(!isValidEmail(email))return next(appErr('Invalid email format',400))
    
    const hashedPass = await bcrypt.hash(password, 10) 
    const hashedAnswer = await bcrypt.hash(answer, 10) 

    const avatar = req.file ? req.processedAvatar : "";

    try { 
        const emailExists = await userModel.findOne({email})
        if (emailExists) return next(appErr(`${email} email is exists. Try another`,401))
        
        if(role === 'admin' && !adminEmails.includes(email))return next(appErr('You are not authorized to create an admin account',403))
        
        const getRole = (email) => adminEmails.includes(email) ? 'admin' : role
        
        const user = await userModel.create({ 
            userName,
            email,
            password:hashedPass,
            address,
            phone,
            avatar,
            question,
            answer:hashedAnswer,
            role:getRole(email)
        })
        user.password = undefined
        user.answer = undefined
        appRes(res,201,'','Registration success',{user})
    } catch (e) {
        return next(appErr(e.message,500))
    }
}

export const signin = async(req,res, next)=>{ 
    const {email,password} = req.body
    if(!email || !password) return next(appErr('email and password are required'),400)
    if(!isValidEmail(email))return next(appErr('Invalid email format',400)) 
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
