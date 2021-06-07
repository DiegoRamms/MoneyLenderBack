const { request, response } = require("express");
const {createCode} = require("../helpers/createCode");
const {encryptPwd}= require("../helpers/encryptPwd");
const User = require('../models/user');


const saveUser = async(req = request, res = response) => {
    const {name,email,password} = req.body
    const {type} = req.type
    
    //Create code 
    const code =  await createCode()
     //Encrypt password
    const user = new User({name,email,code,type})

    user.password = encryptPwd(password)

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