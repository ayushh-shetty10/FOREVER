const express = require("express");
const { adminOnly, authMiddle } = require("../middlewares/authMiddlewear");
const { allOrders, updateStatus, placeOrderCOD, placeOrderStripe, placeOrderRazorpay, userOrders, verifyRazorpay, verifyStripe, markFailed } = require("../controllers/ordersController");

const orderRouter = express.Router();

orderRouter.get('/list',authMiddle,adminOnly,allOrders);
orderRouter.post('/status',authMiddle,adminOnly,updateStatus);

orderRouter.post('/place',authMiddle,placeOrderCOD);
orderRouter.post('/stripe',authMiddle,placeOrderStripe);
orderRouter.post('/razorpay',authMiddle,placeOrderRazorpay);
orderRouter.post('/verifyRazorpay',authMiddle,verifyRazorpay);
orderRouter.post('/verifyStripe',authMiddle,verifyStripe);
orderRouter.post('/markFailed',authMiddle,markFailed);

orderRouter.get('/userorders',authMiddle,userOrders);


module.exports = {orderRouter};