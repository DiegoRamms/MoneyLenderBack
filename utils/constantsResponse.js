const { static, json } = require("express");


// CODES RESPOONSE
const CODE_OK_RESPONSE = 1
const CODE_SESSION_EXPIRED = 2
const CODE_ERROR = 3
const CODE_CANT_ADD = 4
const CODE_NO_INFORMATION_EXISTS = 5
const CODE_NOT_ALLOWED = 6


const baseResponse = ( status, msg,code,data) => {
    return {
        status,
        msg,
        code,
        data
    }
}

module.exports = {
    CODE_OK_RESPONSE,
    CODE_SESSION_EXPIRED,
    CODE_ERROR,
    CODE_CANT_ADD,
    CODE_NO_INFORMATION_EXISTS,
    CODE_NOT_ALLOWED,
    baseResponse
}


