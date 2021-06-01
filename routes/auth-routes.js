const {Router, request, response} = require('express')
const {check} = require('express-validator')
const { login } = require('../controllers/auth-controller')
//const { login } = require('../controllers/auth-controller')

const router = Router()

router.post('/login',
[

],
login
)

module.exports = router