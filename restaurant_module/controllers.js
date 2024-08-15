import appErr from "../utils/appErr.js"
import 'dotenv/config'
import mongoose from 'mongoose'
import appRes from "../utils/appRes.js"
import restaurantModel from '../models/restaurant_model.js'


export const createRestaurant = async(req, res,next)=>{ 
    const {title,hotline, foods,time,pickup,delivery,isOpen,rating,ratingCount,code,coords} = req.body
    
    if(!title || !hotline) return next(appErr('title & hotline ared required',400)) 

    const logo = req.file ? req.processedLogo : "";
   
    try { 
        const isExists = await restaurantModel.find({})

        if(isExists.length>0)return next(appErr('Invalid request. Restaurant is available',400))

        const restaurant = new restaurantModel({ 
            title,
            hotline,
            logo,
            foods,
            time,
            pickup,
            delivery,
            isOpen,
            rating,
            ratingCount,
            code,
            coords
        })
        await restaurant.save()

        appRes(res,200,'',`${restaurant.title} is created!`,{restaurant})

    } catch (e) {
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




