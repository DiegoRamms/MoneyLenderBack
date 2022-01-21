const { request, response } = require("express");
const user = require("../models/user");
const User = require("../models/user");


const validCode = (req = request, res = response,next) =>{
    const code = req.body.code
    const regExp= new RegExp(/^([A-Z0-9]{4})[-]([A-Z0-9]{4})[-]([A-Z0-9]{4})$/)
    const result = regExp.test(code)

    if(!result){
        return res.json({
            status: false,
            msg: 'Codigo invalido'
        })
    }


    if(code == req.user.code){
        return res.json({
            status: false,
            msg: 'No puedes buscarte a ti mismo'
        })
    }

    next()
}


module.exports = {validCode}