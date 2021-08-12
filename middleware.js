const jwt = require('jsonwebtoken')
const tokenSecret = "restaurant-tokens"

exports.verify = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) res.status(403).json({error: "please provide a token"})
    else {
        jwt.verify(token, tokenSecret, (err, value) => {
            if (err)
            {
                res.status(500).json({error: 'failed to authenticate token'})
            } else {
                req.user = value.data
                next(null,value.data)
            }
            
        })
    }
}

exports.authenticate = (token,cb) =>{
    
}