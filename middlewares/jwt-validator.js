const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
    //x-token header
    const token = req.header('x-token');
    
    //Checking if there is a token in the request
    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: `Token is missing in the request`
        });
    }

    try {
        //Checking JWT
        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED)
        
        req.uid = uid;
        req.name = name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: `Invalid token`
        });
    }

    next();
}

module.exports = {
    validateJWT
}