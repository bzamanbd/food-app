import mongoose from 'mongoose';
const { Schema } = mongoose;

const foodSchema = new Schema(
    {
        title: {
          type: String,
          required: [true, "Food title is required"],
        },

        description: {
            type: String,
            required: [true, "Description is required"],
          },
        
        category:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required: [true, "Category is required"]
        },

        price: { 
            type: Number,
            required: [true,"Price is required"]
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: [true, "Restaurant is required"]
          },
        
        images: { type: Array },

        videos:{ type: Array },

        foodTags:{ type:Array },

        code:{ type:String },

        isAvailable:{
            type:Boolean,
            default:true
        },

        rating:{
            type: Number,
            default:1,
            min:1,
            max:5
        },
        
        ratingCount:{
            type: String
        }
    },
    { timestamps:true }
)
const Food = mongoose.model('Food', foodSchema)
export default Food