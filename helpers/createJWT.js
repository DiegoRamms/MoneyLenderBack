const jwt = require('jsonwebtoken')

const creaateJWT = (uid = '', type = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid, type }
        jwt.sign(payload,process.env.SECRETORPRIVATEKEY, {
             expiresIn: '4h'
        }, (err, token) => {
            if(err) {
                console.log(err)
                reject('No se genero token')
            }else {
                resolve(token)
            }
        })
    })
}



module.exports = {
    creaateJWT
}