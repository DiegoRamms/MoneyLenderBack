const { request, response } = require("express")
const { creaateJWT } = require("../helpers/createJWT")
const becrypt = require('bcryptjs')
const User = require("../models/user")


login = async(req = request,res = response) => {
    const {email,password} = req.body

    try{
        const user = await User.findOne({email})

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
    
        const jwt = await creaateJWT(user.id,user.type)
    
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



module.exports = {
    login
}