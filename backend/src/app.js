const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/authRoutes");
const { productRouter } = require("./routes/productsRoutes");
const { cartRouter } = require("./routes/cartRoutes");
const { orderRouter } = require("./routes/orderRoutes");



const app = express();

app.use(cors(
    {
        origin:process.env.FRONTEND_URL,
        credentials:true,
    }
));
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("backend is live and working!");
})

app.use("/api/auth",authRouter);
app.use("/api/product",productRouter);

app.use("/api/cart",cartRouter);
app.use("/api/orders",orderRouter);


module.exports = {app};