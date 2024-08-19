import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema(
    {
        name:{
            type: String,
            required: [true, "Category title is required"],
            unique:true
        },

        image:{
            type: String,
            default:""
        },

        restaurant: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: [true,'restaurant id is required']
        },

        foods: [{
            type: Schema.Types.ObjectId,
            ref: 'Food'
        }],
        
    },
    { timestamps:true }
);
const Category = mongoose.model('Category', categorySchema);
export default Category