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
            const processedImages = images.length > 0 ? await mediaProcessor.processAndMoveMedia({files:images,destinationDir:imageFolderName,imgSize:50,imgQuality:80}) : [];

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

    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400)) 

    if(!_id) return next(appErr('id is required',400))
        
    try {
        const food = await foodModel.findById(_id);
        if (!food) {
            appRes(res,404,'false',`${food.name} not found`,{})

            if(req.files){ 
                // Clean up temporary files
                if(Array.isArray(req.files['images'])){
                    await mediaProcessor.deleteTempFiles(req.files['images'])
                }
                if(Array.isArray(req.files['videos'])){
                    await mediaProcessor.deleteTempFiles(req.files['videos'])
                }
            }
        }

        // Handle images and videos to remove
        let imagesToRemove = req.body.imagesToRemove ? JSON.parse(req.body.imagesToRemove) : [];
        let videosToRemove = req.body.videosToRemove ? JSON.parse(req.body.videosToRemove) : [];

        // Remove old images
        imagesToRemove.forEach(imageUrl => {
            deleteFile(imageUrl); // Utility function to delete file from server
            food.images = food.images.filter(img => img !== imageUrl);
        });

        // Remove old videos
        videosToRemove.forEach(videoUrl => {
            deleteFile(videoUrl); // Utility function to delete file from server
            food.videos = food.videos.filter(vid => vid !== videoUrl);
        });

        // Add new images
        if (req.files['images']) {
            // Process and move images
            const processedImages = await mediaProcessor.processAndMoveMedia({files:req.files['images'],destinationDir:'images',imgSize:50,imgQuality:80});
            const foodImages = []
            pathTrimmer({items:processedImages,newItems:foodImages})
            food.images.push(...foodImages);
            await food.save();
        }
       
        // Add new videos
        if (req.files['videos']) { 
            // Process and move videos
            const processedVideos = await mediaProcessor.processAndMoveMedia({files:req.files['videos'],destinationDir:'videos',isImage:false,videoSize:360});
            const foodVideos = []
            pathTrimmer({items:processedVideos,newItems:foodVideos}) 
            food.videos.push(...foodVideos);
            await food.save();
        }

        // Update other fields if necessary
        if (req.body.name) food.name = req.body.name;
        if (req.body.description) food.description = req.body.description;
        if (req.body.price) food.price = req.body.price;
        if (req.body.category) food.category = req.body.category;

        // Save the updated food item
        await food.save();

        // Clean up temporary files
        if(Array.isArray(req.files['images'])){
            await mediaProcessor.deleteTempFiles(req.files['images'])
        }

        if(Array.isArray(req.files['videos'])){
            await mediaProcessor.deleteTempFiles(req.files['videos'])
        }

        appRes(res,200,'',`${food.name} is updated!`,{food})
    } catch (e) {
        // Clean up temporary files
        if(Array.isArray(req.files['images'])){
            await mediaProcessor.deleteTempFiles(req.files['images'])
        }
        if(Array.isArray(req.files['videos'])){
            await mediaProcessor.deleteTempFiles(req.files['videos'])
        }
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
