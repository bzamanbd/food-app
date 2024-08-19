import mongoose from 'mongoose';
const { Schema } = mongoose;

const restaurantSchema = new Schema(
    {
        name: {
          type: String,
          required: [true, "resturant title is required"],
          unique:true
        },

        address: {
          type: String,
          required: [true, 'address is required']
        },
        
        hotline:{ 
          type: String,
          required:[true, "hotline number is required"],
          unique:true
        },

        logo: {
          type: String,
          default:""
        },

        categories: [{
          type: Schema.Types.ObjectId,
          ref: 'Category'
        }],

        foods: [{
          type: Schema.Types.ObjectId,
          ref: 'Food'
        }],

        time: {
          type: String,
        },

        pickup: {
          type: Boolean,
          default: true,
        },

        delivery: {
          type: Boolean,
          default: true,
        },

        isOpen: {
          type: Boolean,
          default: true,
        },

        rating: {
          type: Number,
          default: 1,
          min: 1,
          max: 5,
        },

        ratingCount: { 
            type: String 
        },

        code: {
          type: String,
        },

        coords: {
          id: { type: String },
          latitude: { type: Number },
          latitudeDelta: { type: Number },
          longitude: { type: Number },
          longitudeDelta: { type: Number },
          address: { type: String },
          title: { type: String },
        },
    },
    { timestamps:true }
);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant