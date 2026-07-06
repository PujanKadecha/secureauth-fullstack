const sanitize = require("mongo-sanitize");

const sanitizeInput = (req,res,next) => {
    if(req.body){
        req.body = sanitize(req.body)
    }
    if(req.query){
        req.query = sanitize(req.query)
    }
    if(req.params){
        req.params = sanitize(req.params)
    }
    next();
}

module.exports = sanitizeInput;