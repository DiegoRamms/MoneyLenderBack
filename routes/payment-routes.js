const { Router } = require("express");
const { check } = require("express-validator");
const { getLoantPaymentsDetail, createPayment, getPaymentsByLoanId, acceptPayment } = require("../controllers/payment-controller");
const {validFields} = require("../middlewares/valid-fields");
const { validJWT } = require("../middlewares/valid-jwt");



const router = Router()


router.post("/loanPaymentDetail",[
    validJWT,
    check('loanId','Id no valido').isMongoId(),
    validFields
], getLoantPaymentsDetail)

router.post("/create",[
    validJWT,
    check('loanId','Id no valido').isMongoId(),
    validFields
],createPayment)


router.post("/paymentsByLoanId",
[
    validJWT,
    check('loanId','Id no valido').isMongoId(),
    validFields,   
], getPaymentsByLoanId)

router.post("/acceptPayment",[
    validJWT,
    validFields
], acceptPayment)


module.exports = router

