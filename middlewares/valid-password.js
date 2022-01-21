

const validPassword = (password = '') => {
    console.log(password)
    const regExpPass = new RegExp('^{8,}$')
    const result = regExpPass.test(password)
    
    if(!result){
        throw new Error('La contraseña debe contener mínimo ocho caracteres, al menos una letra, un número y un carácter especial')
    }
}

module.exports = {validPassword}