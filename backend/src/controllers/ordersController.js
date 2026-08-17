const { orderModel } = require("../models/ordersModel");
const { userModel } = require("../models/userModel");

/**
 * @route POST:api/orders/place
 * @description place orders using COD.
 */
const placeOrderCOD =async (req,res)=> {

    try{
  const {items,address,amount} = req.body;
  const userId=req.user.id;

  const Order = await orderModel.create({
    userId,
    items,
    amount,
    address,
    paymentMethod:"COD",
    payment:false,
    date:Date.now()

  });
  

  await userModel.findByIdAndUpdate(userId,{cartData:{}});

  return res.status(201).json({
    message:"Order placed (COD) successfully!",
    Order
  });

    }
    catch(err){
        console.log(err);
         return res.status(404).json({
    message:"Failed to place order!",
  
  });
    }
};

const placeOrderStripe = (req,res)=> {

};

const placeOrderRazorpay = (req,res)=> {

};
/**
 * @route GET:api/orders/list
 * @description get all orders for admin panel
 */
const allOrders =async (req,res)=> {
    try{
        const allOrders =await orderModel.find({});
        
        return res.status(200).json({
            message:"Orders fetched successfully",
            allOrders
        });
    }
    catch(err){
        console.log(err);
         return res.status(404).json({
            message:"Failed to fetch orders!",
        
          });
    }
};

/**
 * @route POST:api/orders/updateStatus
 * @description update status of order for admin panel
 */
const updateStatus = async (req,res)=> {
   try{
    const {orderId,status} = req.body;
    await orderModel.findByIdAndUpdate(orderId,{status});
    return res.status(200).json({
        message:"Status updated successfully",
    });

   }
   catch(err){
        console.log(err);
         return res.status(404).json({
            message:"Failed to update status!",
        
          });
    }   
};

/**
 * @route GET:api/orders/userorders
 * @description get orders of user.
 */
const userOrders = async(req,res)=> {
    try{
        const userOrders =await orderModel.find({userId:req.user.id});
        
        return res.status(200).json({
            message:"orders fetched successfully",
            userOrders
        });
    }
    catch(err){
        console.log(err);
         return res.status(404).json({
            message:"Failed to fetch orders!",
        
          });
    }

};

module.exports={allOrders,updateStatus,placeOrderCOD,placeOrderRazorpay,placeOrderStripe,userOrders};