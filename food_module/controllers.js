import appErr from "../utils/appErr.js"
import 'dotenv/config'
import mongoose from 'mongoose'
import appRes from "../utils/appRes.js"
import foodModel from '../models/food_model.js';

export const createFood = async(req, res,next)=>{ 
    const payload = req.body
    if(!payload.title || !payload.description || !payload.category || !payload.price || !payload.restaurant) return next(appErr('title,description,category,price and restaurant are required',400))
   
    try { 
        const food = new foodModel(payload)
        await food.save()

        appRes(res,201,'',`${food.title} is created!`,{food})

    } catch (e) {
        return next(appErr(e.message,500))
    }
}

export const fetchFoods = async(req, res,next)=>{ 

    try { 
        const foods = await foodModel.find({})

        if (!foods) return next(appErr('Food not found!',404))
        
        if (foods.length<1) return appRes(res,200,'',`${foods.length} food items found!`,{foods})

        appRes(res,200,'',`${foods.length} food items found!`,{foods})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}

export const fetchFoodsByRestaurantId = async(req, res,next)=>{ 
    const restaurantId = req.params.id 
    if(!restaurantId) return next(appErr('restaurantId is required',400))
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) return next(appErr('Invalid ID format',400)) 

    try { 
        const foods = await foodModel.find({restaurant:restaurantId}).populate('restaurant','title time')

        if (!foods) return next(appErr('Food not found!',404))
        
        if (foods.length<1) return appRes(res,200,'',`${foods.length} food items found!`,{foods})
        
        appRes(res,200,'',`${foods.length} food items found!`,{foods})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}

export const fetchFoodById = async(req, res,next)=>{ 
    const _id = req.params.id 
    if(!_id) return next(appErr('id is required',400))
    
    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400)) 
        
    try { 
        const food = await foodModel.findById({_id})

        if (!food) return next(appErr('Food not found!',404))
        
        appRes(res,200,'',`${food.title} found!`,{food})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}

export const updatFood = async(req, res,next)=>{ 
    const _id = req.params.id
    const payload = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400)) 

    if(!_id) return next(appErr('id is required',400))
        
    try { 
        const food = await foodModel.findByIdAndUpdate(_id,payload,{new:true})

        if (!food) return next(appErr('Food not found!',404))
        
        appRes(res,200,'',`${food.title} is updated!`,{food})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}

export const deleteFood = async(req, res,next)=>{ 
    const _id = req.params.id 
    if(!_id) return next(appErr('id is required',400))
    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400))

    try { 
        const food = await foodModel.findById({_id})

        if (!food) return next(appErr('Food not found!',404))
        
        await foodModel.findByIdAndDelete({_id})
        
        appRes(res,200,'',`${food.title} is deleted!`,{})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}
