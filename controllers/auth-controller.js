const { request, response } = require("express")
const { creaateJWT } = require("../helpers/createJWT")
const becrypt = require('bcryptjs')
const User = require("../models/user")
const { baseResponse, CODE_OK_RESPONSE } = require("../utils/constantsResponse")


const login = async(req = request,res = response) => {
    const {email,password,appType} = req.body
    
    try{
        const user = await User.findOne({email}).populate('type','name')

        if(!user){
            return res.json({
                status: false,
                msg: 'Usuario o Password incorrectos'
            })
        }
        if(user.status == false){
            return res.json({
                status: fasle,
                msg: 'Usuario inactivo'
            })
        }
    
        const validatePassword = becrypt.compareSync(password,user.password)
        if(!validatePassword){
            return res.json({
                status: false,
                msg: 'Usuario o Password incorrectos'
            })
        }
    
        const jwt = await creaateJWT(user.id)

        await User.findByIdAndUpdate(user.id,{jwt})
    
        res.json({
            status: true,
            msg: 'Bienvenido',
            jwt,
            user
        })
    }catch(error){
        res.json({
            status: false,
            msg: 'Error - Solicite ayuda'
           })
    }
    
}

const logout = async(req = request, res = response) => {
    
    const user = req.user
    user.jwt = ""
    await User.findByIdAndUpdate(user.id,user,{new:true})

    return res.json(baseResponse(true,"Sesión cerrada",CODE_OK_RESPONSE))
}

module.exports = {
    login,
    logout
}