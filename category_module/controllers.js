import appErr from "../utils/appErr.js"
import 'dotenv/config'
import mongoose from 'mongoose'
import appRes from "../utils/appRes.js"
import categoryModel from '../models/category_model.js';
import { deleteFile, processImage } from "../utils/imageProcessor.js";
import path from "path";
import { oldImageRemover } from '../utils/oldImageRemover.js';


export const createCategory = async(req, res,next)=>{ 
    const {title} = req.body
    if(!title)return next(appErr('title is required',400))

    try { 
        const exists = await categoryModel.findOne({title})
        if(exists){
            if(req.file){ 
                deleteFile(path.join('./temp', req.file.filename))
            }
            return next(appErr('Category exists',409))
        }
        
        const category = new categoryModel({ title })
        await category.save()
        
        if (category && req.file) {
            const filename = await processImage({
                inputPath: path.join('./temp', req.file.filename),
                outputDir: './public/categories',
                imgWidth: 100,
                imgQuality: 80
            })
            category.image = path.join('./public/categories', filename);
            await category.save();

            // Clean up temporary file after processing
            deleteFile(path.join('./temp', req.file.filename));
        }

        appRes(res,200,'',`${category.title} is created!`,{category})

    } catch (e) {
        if (req.file) {
            deleteFile(path.join('./temp', req.file.filename)); // Clean up on error
        }
        return next(appErr(e.message,500))
    }
}

export const fetchCategories = async(req, res,next)=>{ 

    try { 
        const categories = await categoryModel.find({})

        if (!categories) return next(appErr('Category not found!',404))
        
        if (categories.length<1) return appRes(res,200,'',`${categories.length} categories found!`,{categories})

        appRes(res,200,'',`${categories.length} categories found!`,{categories})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}

export const fetchCategoryById = async(req, res,next)=>{ 
    const _id = req.params.id 
    if(!_id) return next(appErr('id is required',400))
    
    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400)) 
        
    try { 
        const category = await categoryModel.findById({_id})

        if (!category) return next(appErr('Category not found!',404))
        
        appRes(res,200,'',`${category.title} found!`,{category})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}

export const updatCategory = async(req, res,next)=>{ 
    const _id = req.params.id
    const payload = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400)) 
    
    try { 
        // Validate the request body (additional validation can be added as needed)
        if (!payload) return next(appErr('No data provided for update',400))
        
        const existCategory = await categoryModel.findById(_id)
        if(!existCategory)return next(appErr('Category not found!',404))
        
        if(req.file){ 
            // Get && delete the old avatar from db
            oldImageRemover({existImage:existCategory.image})
    
            const filename = await processImage({ 
                inputPath: path.join('./temp', req.file.filename),
                outputDir: './public/categories',
                imgWidth: 100,
                imgQuality: 80
            })
            payload.image = path.join('./public/categories', filename);
            // Clean up temporary file after processing
            deleteFile(path.join('./temp', req.file.filename));
                     
        }
        const category = await categoryModel.findByIdAndUpdate(
            _id,
            {$set:payload},
            {new:true, runValidators:true}
        )
        
        if(!category)return next(appErr('Category is not updated',400))
        appRes(res,200,'','Category update success!',{category})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}

export const deleteCategory = async(req, res,next)=>{ 
    const _id = req.params.id 
    if(!_id) return next(appErr('id is required',400))
    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400))

    try { 
        const category = await categoryModel.findById({_id})

        if (!category) return next(appErr('Category not found!',404))
        
        await categoryModel.findByIdAndDelete({_id})
        
        appRes(res,200,'',`${category.title} is deleted!`,{})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}
