const { request, response } = require("express");
const {createCode} = require("../helpers/createCode");
const {encryptPwd}= require("../helpers/encryptPwd");
const User = require('../models/user');
const { baseResponse, CODE_OK_RESPONSE } = require("../utils/constantsResponse");


const saveUser = async(req = request, res = response) => {
    const {name,email,password} = req.body
    const type = req.type
    
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

const findUser = async(req = request, res = response) =>{
    const code = req.body.code
    const user = await User.findOne({code, status : true})
    res.json(baseResponse((user)? true : false, (user)?"Usuario encontrado":"Usuario no encontrado",CODE_OK_RESPONSE,user))

}


module.exports = {
    saveUser,
    findUser
}