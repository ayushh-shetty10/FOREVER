const mongoose = require ("mongoose");

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    items:{
        type:Array,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    address:{
        type:Object,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:"Order Placed",
    },
    paymentMethod:{
        type:String,
        required:true,
    },
    payment:{
        type:Boolean,
        required:true,
        default:false
    },
    date:{
        type:Date,
        required:true
    }
},{
    timestamps:true,
});

const orderModel = mongoose.model("orders",orderSchema);

module.exports = {orderModel};