import appErr from "../utils/appErr.js"
import 'dotenv/config'
import mongoose from 'mongoose'
import appRes from "../utils/appRes.js"
import restaurantModel from '../models/restaurant_model.js'
import { deleteFile, processImage } from "../utils/imageProcessor.js"
import path from "path"
import fs from 'fs'


export const createRestaurant = async(req, res,next)=>{ 
    const payload = req.body
    
    if(!payload.name || !payload.address || !payload.hotline) return next(appErr('name, address and hotline are required',400)) 

    try { 
        const exists = await restaurantModel.findOne({name: payload.name})
        if(exists){
            deleteFile(path.join('./temp', req.file.filename));
            return next(appErr('Restaurant exists',409))
        }

        const restaurant = new restaurantModel(payload)

        await restaurant.save()

        if (restaurant && req.file) {
            const filename = await processImage({ 
                inputPath: path.join('./temp', req.file.filename),
                outputDir: './public/logos',
                imgWidth: 100,
                imgQuality: 80
            })
            restaurant.logo = path.join('./public/logos', filename);
            await restaurant.save();
            // Clean up temporary file after processing
            deleteFile(path.join('./temp', req.file.filename));
        }

        appRes(res,200,'',`${restaurant.name} is created!`,{restaurant})

    } catch (e) {
        if (req.file) {
            deleteFile(path.join('./temp', req.file.filename)); // Clean up on error
        }
        return next(appErr(e.message,500))
    }
}

export const fetchRestaurents = async(req, res,next)=>{ 

    try { 
        const restaurants = await restaurantModel.find({})

        if (!restaurants) return next(appErr('User not found!',404))
        
        if (restaurants.length<1) return appRes(res,200,'',`${restaurants.length} restaurants found!`,{restaurants})

        appRes(res,200,'',`${restaurants.length} restaurants found!`,{restaurants})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}

export const fetchRestaurentById = async(req, res,next)=>{ 
    const _id = req.params.id 
    if(!_id) return next(appErr('id is required',400))
    
    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400)) 
        
    try { 
        const restaurant = await restaurantModel.findById({_id})

        if (!restaurant) return next(appErr('Restaurant not found!',404))
        
        appRes(res,200,'',`${restaurant.name} found!`,{restaurant})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}

export const editRestaurentById = async(req, res,next)=>{ 
    const _id = req.params.id
    const  payload = req.body

    if(!_id) return next(appErr('id is required',400))
    
    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400))
        
    try { 
        // Validate the request body (additional validation can be added as needed)
        if (!payload || Object.keys(payload).length === 0) return next(appErr('No data provided for update'))
        
        
        if(req.file){ 
            // Get && delete the old logo from db
            const oldRestaurant = await restaurantModel.findById(_id)
            if (oldRestaurant.logo) {
                const oldLogoPath = path.join(oldRestaurant.logo)
                fs.unlinkSync(oldLogoPath)
            }
            
            const filename = await processImage({ 
                inputPath: path.join('./temp', req.file.filename),
                outputDir: './public/logos',
                imgWidth: 100,
                imgQuality: 80
            })
            payload.logo = path.join('./public/logos', filename);
            // Clean up temporary file after processing
            deleteFile(path.join('./temp', req.file.filename));
             
        }
        
        const restaurant = await restaurantModel.findByIdAndUpdate(
            _id,
            { $set: payload },
            { new: true, runValidators: true }
        );
        if(!restaurant)return appRes(res,404,'false',`Restaurant not found!`,{})

        appRes(res,200,'',`${restaurant.name} is updated!`,{restaurant})
        
    } catch (e) {
        if (req.file) {
            deleteFile(path.join('./temp', req.file.filename)); // Clean up on error
        }
        return next(appErr(e.message,500))
    }
}


export const deleteRestaurent = async(req, res,next)=>{ 
    const _id = req.params.id 
    if(!_id) return next(appErr('id is required',400))
    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400))

    try { 
        const restaurant = await restaurantModel.findById({_id})

        if (!restaurant) return next(appErr('Restaurant not found!',404))
        
        await restaurantModel.findByIdAndDelete({_id})
        
        appRes(res,200,'',`${restaurant.name} is deleted!`,{})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}




