import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        userName:{
            type: String,
            required: [true, "user name is required"],
        },

        email:{ 
            type: String,
            required: [true, "email name is required"],
            unique: true,
        },

        password:{ 
            type: String,
            required: [true, "email name is required"],
        },

        address: {
            type: Array,
        },

        phone: {
            type: String,
            required: [true, "phone number is require"],
        },

        usertype: {
            type: String,
            required: [true, "user type is required"],
            default: "clinet",
            enum: ["clinet", "admin", "vendor", "driver"],
        },

        profile: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
        },
        
        answer: {
            type: String,
            required: [true, "Asnwer is required"],
        },
    },
    { timestamps:true }
);
const User = mongoose.model('User', userSchema);
export default User