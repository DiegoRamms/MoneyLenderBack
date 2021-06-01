const { request, response } = require("express")
const { creaateJWT } = require("../helpers/createJWT")
const User = require("../models/user")


login = async(req = request,res = response) => {
    const {email,password} = req.body



    const user = await User.findOne({email})

    const jwt = await creaateJWT(user.id,user.type)

    res.json({
        email,
        password,
        user,
        jwt,
        status: true
    })
}



module.exports = {
    login
}