const express = require("express");
const { login, register, logout, getMe } = require("../controllers/authContollers");
const { authMiddle } = require("../middlewares/authMiddlewear");

const authRouter=express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/logout", logout);
authRouter.get("/me", authMiddle, getMe);


module.exports={authRouter};