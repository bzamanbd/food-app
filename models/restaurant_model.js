import mongoose from 'mongoose';
const { Schema } = mongoose;

const restaurantSchema = new Schema(
    {
        title: {
          type: String,
          required: [true, " Resturant title is required"],
        },
        imageUrl: {
          type: String,
          default:""
        },
        foods: { type: Array },
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
        logoUrl: {
          type: String,
          default:""
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