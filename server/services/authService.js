require('dotenv').config(); //read .env
const fs = require('fs'),
    jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync('private.key');
const publicKey = fs.readFileSync('public.key');
const { JWT_EXPIRATION, JWT_REFRESH_EXPIRATION } = process.env;

const jwt_token = (claims, type = 'access_token') => {
    const token = jwt.sign(
        claims,
        privateKey,
        {
            algorithm: 'RS256',
            expiresIn: type == 'access_token' ? JWT_EXPIRATION : JWT_REFRESH_EXPIRATION
        }
    );
    return token;
}


const jwt_verify = token => {
    return jwt.verify(token, publicKey);
}

module.exports = {
    jwt_token,
    jwt_verify
}