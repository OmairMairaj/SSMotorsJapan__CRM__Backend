const jwt = require('jsonwebtoken');

// function to generate unique confirmation code for user registeration
function genConfCode() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 30; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token
}

const verifyUserTokenMiddleware = (req, res, next) => {
    let token = req.cookies.auth_token

    if(!token){
        return res.status(200).json({
            error: true,
            message: 'Access denied. No token provided.'
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.ENCRYPTION_SECRET_USER)
        req.body.decodedUser = decoded
        next()
    } catch(err){
        return res.status(200).json({
            error: true,
            message: 'Session expired. Please login again.'
        })
    }
}

const signToken =  (payload) => {
    
    return new Promise(function(resolve, reject) {
        jwt.sign(payload, process.env.ENCRYPTION_SECRET_USER, { expiresIn: 172800 }, (signErr, token) => {
            if (signErr) {
                reject(signErr)
            } else {
                resolve(token)
            }
        })
    })    
}

const verifyToken = async (token) => {
    jwt.verify(token, process.env.ENCRYPTION_SECRET_USER, (verifyErr, decoded) => {
        if (verifyErr) {
            return {error: true, decoded: null}
        } else {
            return {error: false, decoded: decoded}
        }
    })
}

module.exports = {
    genConfCode: genConfCode,
    verifyUserTokenMiddleware: verifyUserTokenMiddleware,
    signToken: signToken,
    verifyToken: verifyToken
}