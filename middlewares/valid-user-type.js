const { request } = require("express")
const UserType = require("../models/user-type")



const validUserType = async(req = request, res, next) => {

    const {nameType} = req.body

    const userType = await UserType.findOne({type : nameType})

    if(!userType){
        return res.json({
            status: false,
            msg: 'Tipo de usuario invalido'
        })
    }

    req.type = userType
    
    next()

}


module.exports = {
    validUserType
}
