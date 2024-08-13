import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        foods:[
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Food" 
            }
        ],

        payment:{},

        buyer:{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        },

        status:{ 
            type: String, 
            enum:["preparing","prepared","on the way", "delivered"],
            default:"preparing"
        }

    },
    { timestamps:true }
)
const Order = mongoose.model('Order', orderSchema)
export default Order