const jwt = require('jsonwebtoken')

const creaateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid }
        jwt.sign(payload,process.env.SECRETORPRIVATEKEY, {
             expiresIn: '1w'
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