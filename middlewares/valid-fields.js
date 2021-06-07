const { request, response } = require('express')
const {validationResult} = require('express-validator')




const validFields = (req = request, res = response, next) => {
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.json({
            status: false,
            errors
        })
    }

    next()

}




module.exports = {validFields}