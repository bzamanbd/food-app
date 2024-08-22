import mongoose from 'mongoose';
const { Schema } = mongoose;

const foodSchema = new Schema(
    {
        name: {
          type: String,
          required: [true, "food name is required"],
          unique:true
        },

        description: {
            type: String,
            default:""
        },

        price: { 
            type: Number,
            required: [true,"price is required"]
        },
        
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'category is required']
        },

        restaurant: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: [true, 'restaurant id is required']
        },
        
        images: { 
            type: [String],
            default: [] 
        },

        videos: { 
            type: [String],
            default: [] 
        },

        tags: { 
            type: [String],
            default : []
        },

        code: { 
            type: String,
            default: '' 
        },

        isAvailable:{
            type:Boolean,
            default:true
        },

        rating: {
            type: Number,
            default:1,
            min:1,
            max:5
        },
        
        ratingCount:{
            type: String,
            default: ''
        }
    },
    { timestamps:true }
)
const Food = mongoose.model('Food', foodSchema)
export default Food