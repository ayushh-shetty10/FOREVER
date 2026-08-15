const express =require("express");
const { authMiddle } = require("../middlewares/authMiddlewear");
const { addToCart, updateCart, getMyCart } = require("../controllers/cartController");

const cartRouter = express.Router();

cartRouter.post("/addToCart",authMiddle,addToCart);
cartRouter.post("/updateCart",authMiddle,updateCart);
cartRouter.get("/getMyCart",authMiddle,getMyCart);

module.exports={cartRouter};