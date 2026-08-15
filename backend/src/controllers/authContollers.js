const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userModel } = require("../models/userModel");
const { createToken } = require("../utils/createToken");
const { blackListModel } = require("../models/blackListModel");


/**
 * @route POST:api/auth/register
 * @description registers new users.
 */
const register = async(req,res) => {

    const {username,email,password}=req.body;

    if(!username || !email || !password){
       return res.status(402).json({
           message:"Please enter all the required credentials!"
        })
    }

    const alreadyExists = await userModel.findOne({
        email
    })

    if(alreadyExists){
        return res.status(402).json({
            message:"User already exists with this email!"
        })
    }

    const hashedPass =await  bcrypt.hash(password,10);

    const adminEmails = process.env.ADMIN_MAILS?process.env.ADMIN_MAILS.split(",").map((email)=>{
        return email.trim().toLowerCase();
    }):[];

    const isAdmin = adminEmails.includes(email);




    const user = await userModel.create({
        name:username,
        email,
        password:hashedPass,
        role:isAdmin?"ADMIN":"USER"
    });

    const token = createToken(user._id);

    res.cookie("token",token);

    return res.status(201).json({
        message :"User registered successfully!",
        user:{
            username:user.name,
            email:user.email,
            role:user.role
        },
        token
    });
}

/**
 * @route POST:api/auth/login
 * @description Login user.
 */
const login = async(req,res)=>{

    const {email,password}=req.body;

    if(!email || !password){
        return res.status(402).json({
            message:"Please enter all the required credentials!"
        })
    }

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(404).json({
            message:"User does not exist with this email!"
        })
    }

    const isValidPass = await bcrypt.compare(password,user.password);

    if(!isValidPass){
        return res.status(404).json({
            message:"Invalid password!"
        })
    }

    const token = createToken(user._id);

    res.cookie("token",token);

    return res.status(201).json({
        message:"User logged in successfully!",
        user:{
            username:user.name,
            email:user.email,
            role:user.role
        },
        token
    }
    );
}

/**
 * @route POST:api/auth/logout
 * @description logsout user.
 */
const logout = async(req,res)=>{

    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(200).json({
            message:"User logged out successfully!"
        })
    }

    await blackListModel.create({
        token
    })

    res.clearCookie("token");
    return res.status(200).json({
            message:"User logged out successfully!"
        });

}

/**
 * @route GET:api/auth/me
 * @description Gets current logged in user profile.
 */
const getMe = async(req,res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({
                message: "User not found!"
            });
        }
        return res.status(200).json({
            message: "User profile fetched successfully!",
            user: {
                username: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error!"
        });
    }
}

module.exports = {
    register,
    login,
    logout,
    getMe,
};


