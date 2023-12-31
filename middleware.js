const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    try{
        let token = req.header('x-token');
        if(!token){
            return res.status(400).send('token not found');
        }

        let decode = jwt.verify(token,'ashok');
        req.user = decode.user;
        next();

    }catch(err){
        return res.status(500).send('Token server error')
    }
}