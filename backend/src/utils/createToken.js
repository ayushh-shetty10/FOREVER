const jwt = require("jsonwebtoken");

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});
}

module.exports={createToken};