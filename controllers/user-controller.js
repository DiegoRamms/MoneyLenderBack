const { request, response } = require("express");
const User = require('../models/user')


const saveUser = async(req = request, res = response) => {
    const {name,email,password} = req.body
    const code = "89ya89dy9823y"

    const user = new User({
        name,email,password,code
    })

    await user.save()

    res.json({
        status: true,
        msg: 'Usuario creado',
        user
    })
}

module.exports = {
    saveUser
}