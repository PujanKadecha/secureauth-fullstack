const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_KEY = process.env.JWT_KEY;

const authenticationToken = (req,res,next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({error : "No Token Provided"})
    }

    try{
        const verified = jwt.verify(token,JWT_KEY);
        req.user = verified;
        next();
    }catch(err){
        return res.status(403).json({error : "Invalid Token"})
    }
}

module.exports = authenticationToken;