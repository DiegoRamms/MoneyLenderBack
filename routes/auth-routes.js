const {Router, request, response} = require('express')
const {check} = require('express-validator')
const { login, logout } = require('../controllers/auth-controller')
const { MIN_LENGTH_PWD } = require('../utils/constApp')
const {validFields} = require('../middlewares/valid-fields')
const { validJWT } = require('../middlewares/valid-jwt')

const router = Router()

router.post('/login',
[
    check('email','Usuario no encontrado').isEmail(),
    check('password','Usuario no encontrado').isLength({min:MIN_LENGTH_PWD}),
    check('appType','Error tipo app').not().isEmpty(),
    validFields
],
login
)

router.post('/logout',
    [validJWT,validFields]
,logout)

module.exports = router