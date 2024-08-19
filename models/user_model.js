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
            required: [true, "password is required"],
        },

        phone: {
            type: String,
            required: [true, "phone number is require"],
        },
        
        address: { 
            type: String 
        },

        avatar: {
            type: String,
            default: "",
        },

        question: {
            type: String,
            required: [true, "Question to reset password is required"],
        },
        
        answer: {
            type: String,
            required: [true, "Asnwer to reset password is required"],
        },

        role: {
            type: String,
            default: "client",
            enum: ["client", "admin", "vendor", "driver"],
        },

        orders: [{
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }],
        
    },
    { timestamps:true }
);
const User = mongoose.model('User', userSchema);
export default User