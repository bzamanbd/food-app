import appErr from "../utils/appErr.js"
import bcrypt from "bcryptjs"
import mongoose from 'mongoose'
import 'dotenv/config'
import appRes from "../utils/appRes.js"
import userModel from '../models/user_model.js'
import path from "path"
import { processImage, deleteFile } from '../utils/imageProcessor.js';
import { oldImageRemover } from "../utils/oldImageRemover.js"


export const fetchUsers = async(req, res,next)=>{ 

    try { 
        const users = await userModel.find()

        if (users.length <1) return appRes(res,200,'',`${users.length} user found!`,{users})
        
        users.forEach(user =>user.password = undefined)
        
        appRes(res,200,'',`${users.length} users found!`,{users})

    } catch (e) {
        return next(appErr(e.message,500))
    }
}

export const fetchProfile = async(req, res,next)=>{ 
    const _id = req.user.id
    if(!_id) return next(appErr('_id is required'),400)   
try { 
    const user = await userModel.findById(_id)

    if (!user) return next(appErr('User not found!',404))
        
    user.password = undefined
    appRes(res,200,'',`${user.name}'s profile`,{user})
} catch (e) {
    return next(appErr(e.message,500))
}
}

export const updateProfile = async(req,res, next)=>{ 
    const _id = req.user.id 
    const  payload = req.body

    if(!_id) return next(appErr('_id is required'),400) 
    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400))

    try {
        // Validate the request body (additional validation can be added as needed)
        if (!payload || Object.keys(payload).length === 0) return next(appErr('No data provided for update'))

        const existUser = await userModel.findById(_id)
        if(!existUser)return next(appErr('User not found!',404))
        
        if(req.file){ 
            // Get && delete the old avatar from db
            oldImageRemover({existImage:existUser.avatar})

            const filename = await processImage({ 
                inputPath: path.join('./temp', req.file.filename),
                outputDir: './public/avatars',
                imgWidth: 100,
                imgQuality: 80
            })
            payload.avatar = path.join('./public/avatars', filename);
            // Clean up temporary file after processing
            deleteFile(path.join('./temp', req.file.filename));
                 
        }

        const user = await userModel.findByIdAndUpdate(
            _id,
            {$set:payload},
            {new:true, runValidators:true}
        )
        
        if(!user)return next(appErr('Profile is not updated',400))
        appRes(res,200,'','Profile update success!',{user})
    
    } catch (e) {
        if (req.file) {
            deleteFile(path.join('./temp', req.file.filename)); // Clean up on error
        }
        return next(appErr(e.message,500))
    } 

}

export const fetchQuestion = async(req, res,next)=>{ 
    const {email} = req.body
    if(!email)return next(appErr('email is required',400))

    try { 
        const user = await userModel.findOne({email})

        if (!user) return next(appErr('User not found!',404))
        
        const question = user.question
        
        appRes(res,200,'',`${user.userName}'s question`,{question})

    } catch (e) {
        return next(appErr(e.message,500))
    }
}

export const resetPassword = async(req,res, next)=>{ 
    const {email,newPassword,answer} = req.body
    if(!email || !newPassword || !answer) return next(appErr('email,newPassword and answer are required',400)) 

    try {
        const user = await userModel.findOne({email})
        if(!user)return next(appErr('User not found!',404)) 
        const isMatchAnswer = await bcrypt.compare(answer, user.answer);
        if(!isMatchAnswer) return next(appErr('Invalid answer',400))
        const hashedAnswer = await bcrypt.hash(answer,10)
        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.answer = hashedAnswer
        user.password = hashedPassword
        await user.save()

        user.password = undefined
        appRes(res,200,'','Password reset success!',{user})
    } catch (e) {
        return next(appErr(e.message,500))
    } 

}

export const updatePassword = async(req,res, next)=>{ 
    const _id = req.user.id
    const {oldPassword,newPassword} = req.body 
    
    if(!oldPassword || !newPassword) return next(appErr('oldPassword and newPassword are required',400)) 

    try {
        const user = await userModel.findById({_id})
        if(!user)return next(appErr('User not found!',404)) 
        const isMatchOldPassword = await bcrypt.compare(oldPassword, user.password);
        if(!isMatchOldPassword) return next(appErr('Invalid old password',400))
        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword
        await user.save()

        user.password = undefined
        appRes(res,200,'','Password update success!',{user})
    } catch (e) {
        return next(appErr(e.message,500))
    } 

}

export const deleteOwnAccount = async(req,res, next)=>{ 
    const _id = req.user.id

    if(!_id) return next(appErr('_id is required',400)) 

    try {
        const user = await userModel.findById({_id})
        if (!user) return next(appErr('User not found!',404))
        await userModel.findByIdAndDelete({_id})
        appRes(res,200,'','Your account is deleted successfully!',{})
    } catch (e) {
        return next(appErr(e.message,500))
    } 

}



