require("dotenv").config();
const { app } = require("./src/app");
const { connectDB } = require("./src/db/db");
const { connectCloudinary } = require("./src/services/cloudinary");

connectDB();
connectCloudinary();

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

