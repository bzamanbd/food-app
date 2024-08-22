import appErr from "../utils/appErr.js"
import 'dotenv/config'
import mongoose from 'mongoose'
import appRes from "../utils/appRes.js"
import foodModel from '../models/food_model.js';
import mediaProcessor from '../utils/mediaProcessor.js'
import { pathTrimmer } from '../utils/pathTrimmer.js';
import { deleteFile } from "../utils/oldImageRemover.js";


export const createFood = async(req, res,next)=>{ 
    const payload = req.body;
    if(!payload.name || !payload.price)return next(appErr('name & price are required',400))

    const { images = [], videos = [] } = req.files;
    const imageFolderName = 'images'; // Dynamic folder name for images
    const videoFolderName = 'videos'; // Dynamic folder name for videos

    try { 
        const existFood = await foodModel.findOne({name:payload.name}) 
        if(existFood){ 
            if(req.files){
                await mediaProcessor.deleteTempFiles([...images, ...videos]);
            }
            return next(appErr(`${payload.name} is already exists`,409)) 
        }
        
        const food = new foodModel(payload)
        await food.save()

        if(food){
            // Process and move images
            const processedImages = images.length > 0 ? await mediaProcessor.processAndMoveMedia({files:images,destinationDir:imageFolderName,imgSize:800,imgQuality:80}) : [];

            // Process and move videos
            const processedVideos = videos.length > 0 ? await mediaProcessor.processAndMoveMedia({files:videos,destinationDir:videoFolderName,isImage:false,videoSize:360}) : [];

            const foodImages = []
            const foodVideos = []

            pathTrimmer({items:processedImages,newItems:foodImages})
            pathTrimmer({items:processedVideos,newItems:foodVideos}) 

            food.images = foodImages;
            food.videos = foodVideos;
            await food.save();
        }

        await mediaProcessor.deleteTempFiles([...images, ...videos]);

        appRes(res,201,'',`${food.name} is created!`,{food})

    } catch (e) {
        // If post creation fails, delete uploaded files from temp
        await mediaProcessor.deleteTempFiles([...images, ...videos]);
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
        const foods = await foodModel.find({restaurant:restaurantId}).populate('restaurant','name time')

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
        
        appRes(res,200,'',`${food.name} found!`,{food})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}

export const editFood = async(req, res,next)=>{ 
    const _id = req.params.id
    const payload = req.body
    const { images = [], videos = [] } = req.files;
    
    const imageFolderName = 'images'; // Dynamic folder name for images
    const videoFolderName = 'videos'; // Dynamic folder name for videos

    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400)) 

    if(!_id) return next(appErr('id is required',400))
        
    try {
        // Validate the request body (additional validation can be added as needed)
        if (!payload) return next(appErr('No data provided for update',400))

        const existFood = await foodModel.findById(_id)
        // Delete images & videos files from the temp folder if the food is not exists in db
        
        if(!existFood){
            req.file.mimetype.startsWith('image/')? await mediaProcessor.deleteTempFiles([...images]) : await mediaProcessor.deleteTempFiles([...videos]);
            return next(appErr('Food not found!',404))
        }
        
        if (payload.imagesToRemove) {
            // Parse the imagesToRemove array from the request body
            let imagesToRemove = [];
            imagesToRemove = JSON.parse(payload.imagesToRemove); // Convert JSON string to array
            // Delete old images if any are specified
            imagesToRemove.forEach(imageUrl => {
                deleteFile(imageUrl); // Utility function to delete file from server
                existFood.images = existFood.images.filter(img => img !== imageUrl);
            });
            await existFood.save();
        }
        
        if (payload.videosToRemove) {
            // Parse the videosToRemove array from the request body
            let videosToRemove = [];
            videosToRemove = JSON.parse(payload.videosToRemove); // Convert JSON string to array
            // Delete old videos if any are specified
            videosToRemove.forEach(videoUrl => {
                deleteFile(videoUrl); // Utility function to delete file from server
                existFood.videos = existFood.videos.filter(vid => vid !== videoUrl);
            });
            await existFood.save();
        }
        
        if(req.files){ 
            // Add new images into payload.images
            if(req.file.mimetype.startsWith('image/')){
                const newImages = req.files.map(file => file.path); // Array of new image paths
                payload.images.push(...newImages);
                // Process and move images
                const processedImages = images.length > 0 ? await mediaProcessor.processAndMoveMedia({files:images,destinationDir:imageFolderName,imgSize:800,imgQuality:80}) : [];
                const foodImages = []
                pathTrimmer({items:processedImages,newItems:foodImages})
                payload.images = foodImages;
            }

            // Add new videos into payload.videos
            if(req.file.mimetype.startsWith('video/')){
                const newVideos = req.files.map(file => file.path); // Array of new image paths
                payload.videos.push(...newVideos);
                // Process and move videos
                const processedVideos = videos.length > 0 ? await mediaProcessor.processAndMoveMedia({files:videos,destinationDir:videoFolderName,isImage:false,videoSize:360}) : [];
                const foodVideos = []
                pathTrimmer({items:processedVideos,newItems:foodVideos})
                payload.videos = foodVideos;
            }

            // Clean up temporary file after processing
            await mediaProcessor.deleteTempFiles([...images, ...videos])
        }

        const food = await foodModel.findByIdAndUpdate(
            _id,
            {$set:payload},
            {new:true, runValidators:true}
        )

        if (!food) return next(appErr('Food not found!',404))
        appRes(res,200,'',`${food.name} is updated!`,{food})    
    } catch (e) {
            await mediaProcessor.deleteTempFiles([...images, ...videos]);
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
        
        appRes(res,200,'',`${food.name} is deleted!`,{})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}
