const { orderModel } = require("../models/ordersModel");
const { userModel } = require("../models/userModel");
const Stripe = require("stripe");
const razorpay = require("razorpay");
const crypto = require("crypto");

//global variables:
const currency = "inr";
const delivery_fee = 5.00;

//stripe initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
  key_id:process.env.RAZORPAY_API_KEY,
  key_secret:process.env.RAZORPAY_KEY_SECRET
})



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

const placeOrderStripe = async(req,res)=> {
  try{
      const {items,address,amount} = req.body;
  const userId=req.user.id;
  const {origin} = req.headers;

  const newOrder = await orderModel.create({
    userId,
    items,
    amount,
    address,
    paymentMethod:"Stripe",
    payment:false,
    date:Date.now()
  });

  const line_items = items.map((item)=> ({
    price_data: {
      currency: "usd",
      product_data: {
        name:item.name
      
      },
      unit_amount:item.price*100,
    },
    quantity:item.quantity,
  }));

  line_items.push({
    price_data: {
      currency: "usd",
      product_data: {
        name:"Delivery fee"
      
      },
      unit_amount:delivery_fee*100,
    },
    quantity:1,
  })
   
  const session = await stripe.checkout.sessions.create({
    success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
    line_items,
    mode:'payment',
    
  });

  return res.status(201).json({
    success:true,
    message:"Order placed (Stripe) successfully!",
    session_url:session.url
  });
  }
  catch(err){
    console.log(err);
    return res.status(404).json({
      success:false,
      message:"Failed to place order!"
    });
  }
};

const placeOrderRazorpay =async (req,res)=> {
  try{
    const {items,address,amount} = req.body;
  const userId=req.user.id;
  

  const newOrder = await orderModel.create({
    userId,
    items,
    amount,
    address,
    paymentMethod:"Razorpay",
    payment:false,
    date:Date.now()
  });

    const options = {
      amount : amount * 100,
      currency : "INR",
      receipt:newOrder._id.toString(),
    }
    await razorpayInstance.orders.create(options,(error,order)=>{
      if(error){
        console.log(error);
        return res.status(400).json({
          success:false,
          message:"order creation failed!"
        });
      }
      return res.status(201).json({
        success:true,
        message:"Order placed (Razorpay) successfully!",
        order
      });
    });
  }
  catch(err){
    console.log(err);
    return res.status(404).json({
      success:false,
      message:"Failed to place order!"
    });
  }
};

const verifyRazorpay = async(req,res)=>{
  try{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
// console.log("razorpay_order_id",razorpay_order_id);
// console.log("razorpay_payment_id",razorpay_payment_id);
// console.log("razorpay_signature",razorpay_signature);

    const sign = razorpay_order_id +"|" + razorpay_payment_id;

    const expectedSign = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");

    if(expectedSign !== razorpay_signature){
      return res.status(400).json({
        success:false,
        message:"Invalid signature!",
      });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
console.log(orderInfo);
    if(orderInfo.status==="paid"){
      await orderModel.findByIdAndUpdate(orderInfo.receipt  ,{payment:true});
      await userModel.findByIdAndUpdate(req.user.id,{cartData:{}});
    
    return res.status(201).json({
      success:true,
      message: "Payment (Razorpay) successfull!",
    });
  }else{
    return res.status(400).json({
      success:false,
      message: "Payment failed(Razorpay !",
    });
  }
  }
  catch(err){
   console.log(err);
    return res.status(404).json({
      success:false,
      message:"Failed to verify order!"
    });
  }
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
        const userOrders =await orderModel.find({
            userId:req.user.id,
            $or: [
                { payment: true },
                { paymentMethod: "COD" }
            ]
        });
        
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

const markFailed = async(req,res)=>{
  try{
    const {orderId} = req.body;
    const order = await orderModel.findById(orderId);
    if(!order){
      return res.status(404).json({
        success:false,
        message:"Order not found!"
      });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success:false,
        message:"Unauthorized action!"
      });
    }

    if(order.payment === false && order.paymentMethod !== "COD"){
      order.status = "Failed";
      await order.save();
      return res.status(200).json({
        success:true,
        message:"Order marked as failed successfully!"
      });
    }

    return res.status(400).json({
      success:false,
      message:"Cannot mark paid or COD order as failed!"
    });
  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Failed to update order status!"
    });
  }
};

module.exports={allOrders,updateStatus,placeOrderCOD,placeOrderRazorpay,placeOrderStripe,userOrders,verifyRazorpay,markFailed};