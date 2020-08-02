var express = require('express');
const router = express.Router();
expressValidator = require('express-validator');
var userController = require('../controller/user.controller')
router.use(expressValidator());

router.post('/signUp', userController.userCreate);
router.get('/forgetPassword/', userController.passwordReset);
//router.get('/verifyAccount/:token', userController.confirmAccount);

module.exports = router