var express = require('express');
const router = express.Router();
expressValidator = require('express-validator');
var userController = require('../controller/user.controller')
router.use(expressValidator());

router.get('/verifyAccount/:token', userController.confirmAccount);
router.get('/getToken', userController.getToken);

router.post('/signUp', userController.userCreate);
router.post('/verify',userController.verifyAccount);
router.post('/login', userController.login);
router.post('/forgetPassword', userController.passwordReset);
router.post('/updatePassword', userController.updatePassword);

module.exports = router;