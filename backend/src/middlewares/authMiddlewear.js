const jwt = require("jsonwebtoken");
const { blackListModel } = require("../models/blackListModel");
const { userModel } = require("../models/userModel");

const authMiddle = async (req,res,next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"No token,Unauthorized access!"
        })
    }
    try{
        const blackListed = await blackListModel.findOne({token});
        if(blackListed){
            return res.status(401).json({
                message:"Blacklisted token! Unauthorized access!"
            })
        }

    const decoded =  jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user=decoded;
    return next();
    }catch(err){
        console.log(err);
        return res.status(401).json({
            message:"Wrong token! Unauthorized access!"
        })
    }
}

const adminOnly = async(req,res,next)=>{
    const user = await userModel.findById(req.user.id);
    if(user.role !== "ADMIN"){
        return res.status(403).json({
            message:"Access denied! Admins only!"
        })
    }
    return next();
}

module.exports = {authMiddle,adminOnly};