import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema(
    {
        title:{
            type: String,
            required: [true, "Category title is required"],
        },
        imageUrl:{
            type: String,
            default:"https://dynamic.brandcrowd.com/asset/logo/e76a6d2e-2a33-4b38-8ea3-07bd07e9763c/logo-search-grid-2x?logoTemplateVersion=1&v=638565293261700000"
        }
    },
    { timestamps:true }
);
const Category = mongoose.model('Category', categorySchema);
export default Category