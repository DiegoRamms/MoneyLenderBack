const { Router } = require("express")
const { check } = require("express-validator")
const { addContact,pendingContacts, contactsToAccpet, getContacts, accept, deleteRequest } = require("../controllers/contact-controller")
const { validCode } = require("../middlewares/valid-code")
const { validFields } = require("../middlewares/valid-fields")
const { validJWT } = require("../middlewares/valid-jwt")

const router = Router()


router.post('/add',[
    validJWT,
    check('code','El codigo es obligatorio').not().isEmpty(),
    validCode,
    validFields],
    addContact
)

router.post('/listPending',[
    validJWT
],pendingContacts)


router.post('/listToAccept',[
    validJWT
],contactsToAccpet)

router.post('/getContacts',[
    validJWT
],getContacts)

router.post('/accept',[
    validJWT,
    check('contactId','Id invalido').isMongoId(),
    validFields
],accept)

router.post("/cancelRequest",[
    validJWT,
    check('contactId','Id invalido').isMongoId(),
    validFields
], deleteRequest)



module.exports = router