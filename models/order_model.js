import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema(
    {

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'user is required']
        },

        restaurant: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: [true, 'restaurant is required']
        },

        items: [{
            food: {
                type: Schema.Types.ObjectId,
                ref: 'Food',
                required: [true,'food is required']
            },
            quantity: {
                type: Number,
                required: [true, 'quintity is required']
            }
        }],

        totalAmount: {
            type: Number,
            required: [true,'total ammount is required']
        },

        payment:{},

        status:{ 
            type: String, 
            enum:["preparing","prepared","on the way", "delivered", "cancelled"],
            default:"preparing"
        }

    },
    { timestamps:true }
)
const Order = mongoose.model('Order', orderSchema)
export default Order