const bcrypt = require('bcryptjs')

const encryptPwd = (text) => {
    const salt = bcrypt.genSaltSync()
    const  encrypted =  bcrypt.hashSync(text,salt)   
    return encrypted
} 

module.exports = {
    encryptPwd
}