import appErr from "../utils/appErr.js"
import 'dotenv/config'
import mongoose from 'mongoose'
import appRes from "../utils/appRes.js"
import restaurantModel from '../models/restaurant_model.js'
import { deleteFile, processImage } from "../utils/imageProcessor.js"
import path from "path"


export const createRestaurant = async(req, res,next)=>{ 
    const {title,hotline,foods,time,pickup,delivery,isOpen,rating,ratingCount,code,coords} = req.body
    
    if(!title || !hotline) return next(appErr('title & hotline ared required',400)) 

    try { 
        
        const exists = await restaurantModel.findOne({title})

        if(exists){
            if(req.file){ 
                deleteFile(path.join('./temp', req.file.filename))
            }
            return next(appErr('Restaurant exists',409))
        }

        const restaurant = new restaurantModel({ 
            title,
            hotline,
            foods,
            time,
            pickup,
            delivery,
            isOpen,
            rating,
            ratingCount,
            code,
            coords,
        })

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

        appRes(res,200,'',`${restaurant.title} is created!`,{restaurant})

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
        
        appRes(res,200,'',`${restaurant.title} found!`,{restaurant})
    } catch (e) {
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
        
        appRes(res,200,'',`${restaurant.title} is deleted!`,{})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}




