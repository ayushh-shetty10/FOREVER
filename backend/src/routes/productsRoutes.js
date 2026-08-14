const express = require("express");
const { upload } = require("../middlewares/multer");
const { addProduct, listProducts, removeProduct,getProduct } = require("../controllers/productControllers");
const { authMiddle, adminOnly } = require("../middlewares/authMiddlewear");

const productRouter = express.Router();

productRouter.post("/addProduct",upload.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}]),authMiddle,adminOnly,addProduct);
 productRouter.get("/listProducts",listProducts);
 productRouter.post("/removeProduct",authMiddle,adminOnly,removeProduct);
 productRouter.post("/getProductInfo",getProduct);

module.exports = {productRouter};