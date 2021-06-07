const crypto = require('crypto');
const User = require('../models/user');

const createCode = async() => {
    let code = ''
    let user
    do{
        code = randomValueHex()+"-"+randomValueHex()+"-"+randomValueHex();
        user = await User.findOne({code})
    }while(user != null)
    
    return code
} 

const randomValueHex = () => {
    return crypto.randomBytes(Math.ceil(4/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,4).toUpperCase();   // return required number of characters
}

module.exports = {createCode}