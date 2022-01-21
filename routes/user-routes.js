const { Router } = require("express");
const { check } = require("express-validator");
const { saveUser, findUser } = require("../controllers/user-controller");
const { MIN_LENGTH_PWD } = require("../utils/constApp");
const { existUser } = require("../helpers/db-validator");
const {validCode} = require("../middlewares/valid-code");
const {validFields} = require("../middlewares/valid-fields");
const { validJWT } = require("../middlewares/valid-jwt");
const {validPassword} = require("../middlewares/valid-password");
const {validUserType} = require("../middlewares/valid-user-type");

const router = Router()



router.post('/',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('password','La contraseña no debe de ser menor a 8 caracteres').isLength({min: MIN_LENGTH_PWD}),
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','No es un correo valido').isEmail(),
    check('nameType','El tipo es obligatorio').not().isEmpty(),
    validUserType,
    check('email').custom(existUser),
    validFields
],saveUser)

router.post('/find',[
    validJWT,
    check('code','El codigo es obligatorio').not().isEmpty(),
    validCode,
    validFields,
],findUser)



module.exports = router
