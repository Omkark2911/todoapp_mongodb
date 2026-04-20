const jwt = require("jsonwebtoken");

function authMiddleware(req,res,next){
    const token = req.headers.token;
    const decoded = jwt.verify(token,"secret123123");

    if(decoded.userId){
        req.userId = decoded.userId;
        next()
    } else {
        res.status(403).json({
            message:"token invalid or not found"
        })
    }
}
module.exports = {
    authMiddleware: authMiddleware
}