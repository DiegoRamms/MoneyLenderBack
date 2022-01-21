const { Router, request, response } = require("express");
const { check } = require("express-validator");
const { createLoan, deleteLoan, getLoans, getLoansByUsertId, updateLoan } = require("../controllers/loan-controller");
const {validFields} = require("../middlewares/valid-fields");
const { validJWT } = require("../middlewares/valid-jwt");



const router = Router()

router.post("/create",[
    validJWT,
    check('contactId','Id no valido').isMongoId(),
    check('amount','El monto no debe de ser vacio').not().isEmpty(),
    check('paymentsTime','El tiempo de pago no debe de ser vacio').not().isEmpty(),
    check('interestPercent','El porcentaje de interes no debe de ser vacio').not().isEmpty(),
    check('interestTime','El interes en el tiempo no debe de ser vacio').not().isEmpty(),
    check('dateStart','La fecha de inicio no debe se ser vacia').not().isEmpty(),
    check('dateLimit','La fecha limite no debe de ser vacia').not().isEmpty(),
    validFields
],createLoan)

router.post("/delete",[
    validJWT,
    check('loanId','Id no valido').isMongoId(),
    validFields
],deleteLoan)

router.post("/update",[
    validJWT,
    check('loanId','Id no valido').isMongoId(),
    check('amount','El monto no debe de ser vacio').not().isEmpty(),
    check('paymentsTime','El tiempo de pago no debe de ser vacio').not().isEmpty(),
    check('interestPercent','El porcentaje de interes no debe de ser vacio').not().isEmpty(),
    check('interestTime','El interes en el tiempo no debe de ser vacio').not().isEmpty(),
    check('dateStart','La fecha de inicio no debe se ser vacia').not().isEmpty(),
    check('dateLimit','La fecha limite no debe de ser vacia').not().isEmpty(),
    validFields
],updateLoan)


router.post('/getLoans',[
    validJWT,
    validFields
],getLoans)


router.post('/getLoansByContactId',[
    validJWT,
    check('userId','Id invalido').isMongoId(),
    validFields
],getLoansByUsertId)

router.post('/delailById',[
    validJWT,
    check('loanId','Id invalido').isMongoId()
],)

module.exports = router