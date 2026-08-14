const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    },
    password:{
        type:String,
        required:true,
    },
    cartData:{
        type:Object,
        default:{}
    },
    role:{
        type:String,
        default:"USER",
        enum:["USER","ADMIN"]
    }

},{minimize:false})

const userModel=mongoose.model("user",userSchema);
module.exports={userModel};