import appErr from "../utils/appErr.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import appRes from "../utils/appRes.js"
import userModel from '../models/user_model.js'
import adminEmails from "../utils/adminEmails.js"
import isValidEmail from '../utils/isValidEmail.js';
import path from 'path';
import { deleteFile, processImage } from "../utils/imageProcessor.js"

export const signup = async(req, res,next)=>{ 
    
    const payload = req.body
    
    if(!payload.name || !payload.email || !payload.password || !payload.phone || !payload.question || !payload.answer) return next(appErr('name,email,password,phone,question and answer are required'),400) 
    
    if(!isValidEmail(payload.email))return next(appErr('Invalid email format',400))
    
    try { 
        const emailExists = await userModel.findOne({email: payload.email})

        if (emailExists){
            if(req.file){ 
                deleteFile(path.join('./temp', req.file.filename))
            }
            return next(appErr(`${payload.email} email is exists. Try another`,401))
        }
        
        if(payload.role === 'admin' && !adminEmails.includes(payload.email))return next(appErr('You are not authorized to create an admin account',403))
        
        const hashedPass = await bcrypt.hash(payload.password, 10) 
        const hashedAnswer = await bcrypt.hash(payload.answer, 10) 
        
        const email = payload.email;
        const getRole = (email) => adminEmails.includes(email) ? 'admin' : payload.role

        payload.password = hashedPass;
        payload.answer = hashedAnswer;
        payload.role = getRole(email); 

        const user = new userModel(payload)
        
        await user.save();
        
        if(user && req.file){ 
            const filename = await processImage({ 
                inputPath: path.join('./temp',req.file.filename),
                outputDir: './public/avatars',
                imgWidth: 100,
                imgQuality: 80
            })

            user.avatar = path.join('./public/avatars', filename);
            await user.save();

            // Clean up temporary file after processing
            deleteFile(path.join('./temp', req.file.filename));
        }

        user.password = undefined
        user.answer = undefined
        appRes(res,201,'','Registration success',{user})

    } catch (e) {
        if (req.file) {
            deleteFile(path.join('./temp', req.file.filename)); // Clean up on error
        }
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
        
        // eslint-disable-next-line no-undef
        const tocken = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn: '1h'}) 

        appRes(res,200,'','Login success!',{tocken})
    } catch (e) {
        return next(appErr(e.message,500))
    } 

}
