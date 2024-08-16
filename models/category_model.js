import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema(
    {
        title:{
            type: String,
            required: [true, "Category title is required"],
            unique:true
        },

        image:{
            type: String,
            default:""
        }
        
    },
    { timestamps:true }
);
const Category = mongoose.model('Category', categorySchema);
export default Category