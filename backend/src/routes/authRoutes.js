const express = require("express");
const { login, register, logout } = require("../controllers/authContollers");

const authRouter=express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/logout", logout);


module.exports={authRouter};