const express = require("express")
const router = express.Router()
const userControler = require('./controllers/UserController')

router.get('/', userControler.home)
router.post('/register', userControler.register)
router.post('/login', userControler.login)
router.post('/logout', userControler.logout)


module.exports = router