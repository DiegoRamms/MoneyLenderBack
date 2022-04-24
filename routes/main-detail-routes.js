const { Router } = require("express");
const { getMainDetail } = require("../controllers/mian-detail-controller");
const { validFields } = require("../middlewares/valid-fields");
const { validJWT } = require("../middlewares/valid-jwt");


const router = Router()


router.post("/getMainDetail",[
    validJWT,
    validFields
],getMainDetail)




module.exports = router