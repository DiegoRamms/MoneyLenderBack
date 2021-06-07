const { Router } = require("express");
const { check } = require("express-validator");
const { saveUser } = require("../controllers/user-controller");
const { existUser } = require("../helpers/db-validator");
const {validFields} = require("../middlewares/valid-fields");
const {validPassword} = require("../middlewares/valid-password");
const {validUserType} = require("../middlewares/valid-user-type");

const router = Router()



router.post('/',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('password','La contraseña no debe de ser menor a 8 caracteres').isLength({min: 8}),
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','No es un correo valido').isEmail(),
    check('nameType','El tipo es obligatorio').not().isEmpty(),
    validUserType,
    check('email').custom(existUser),
    validFields
],saveUser)



module.exports = router
