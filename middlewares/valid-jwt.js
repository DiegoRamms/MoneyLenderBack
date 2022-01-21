const { request, response } = require("express");
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { baseResponse } = require("../utils/constantsResponse");
const constants = require("../utils/constantsResponse");



const validJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token')

    if(!token){
        return res.json(
            baseResponse(false,'Token vacio',constants.CODE_SESSION_EXPIRED)
        )
    }

    try{
        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY)
        const user = await User.findById(uid)

        if(!user){
           return res.json(
                baseResponse(false,"Sesión expirada",constants.CODE_SESSION_EXPIRED)
            )
        }

        if(!user.status){
           return res.json(
                baseResponse(false,'Sesión expirada',constants.CODE_SESSION_EXPIRED)
            )
        }

       
        if(user.jwt != token){
            return res.json(
                baseResponse(false,'Sesión expirada',constants.CODE_SESSION_EXPIRED)
            )
        }
        
    
        req.user = user

        next()
    }catch(err){
        if(err instanceof jwt.TokenExpiredError) {
            return res.json(baseResponse(false,"Sesión expirada",constants.CODE_SESSION_EXPIRED))
        }
        return res.json(
            baseResponse(false,"Intente más tarde",constants.CODE_ERROR)
        )
    }

}


module.exports = {validJWT}