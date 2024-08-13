import appErr from "../utils/appErr.js"
import 'dotenv/config'
import mongoose from 'mongoose'
import appRes from "../utils/appRes.js"
import orderModel from '../models/order_model.js'

// createOrder,fetchOrders,fetchOrderById,deleteOrder

export const createOrder = async(req, res,next)=>{
    const buyer = req.user._id 
    const {foods} = req.body
    if(!foods) return next(appErr('foods is required',400))
    
    let total = 0;

    foods.map(food=>total+=food.price)

    try { 
        const order = new orderModel({ buyer,foods,payment:total})
        await order.save()

        appRes(res,200,'',`New order placed!`,{order})

    } catch (e) {
        return next(appErr(e.message,500))
    }
}

export const fetchOrders = async(req, res,next)=>{ 

    try { 
        const orders = await orderModel.find({})

        if (!orders) return next(appErr('Order not found!',404))
        
        if (orders.length<1) return appRes(res,200,'',`${orders.length} orders found!`,{orders})

        appRes(res,200,'',`${orders.length} orders found!`,{orders})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}


export const fetchOrderById = async(req, res,next)=>{ 
    const _id = req.params.id 
    if(!_id) return next(appErr('id is required',400))
    
    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400)) 
        
    try { 
        const order = await orderModel.findById({_id}).populate('foods')

        if (!order) return next(appErr('Order not found!',404))
        
        appRes(res,200,'',`New order found!`,{order})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}


export const deleteOrder = async(req, res,next)=>{ 
    const _id = req.params.id 
    if(!_id) return next(appErr('id is required',400))
    if (!mongoose.Types.ObjectId.isValid(_id)) return next(appErr('Invalid ID format',400))

    try { 
        const order = await orderModel.findById({_id})

        if (!order) return next(appErr('Order not found!',404))
        
        await orderModel.findByIdAndDelete({_id})
        
        appRes(res,200,'',`${order._id} is deleted!`,{})
    } catch (e) {
            return next(appErr(e.message,500))
        }
}




