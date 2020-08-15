var express = require('express');
const router = express.Router();
expressValidator = require('express-validator');
var userController = require('../controller/user.controller')
router.use(expressValidator());

router.post('/signUp', userController.userCreate);
router.get('/verifyAccount/:token', userController.confirmAccount);
router.get('/Login', userController.login);
router.get('/forgetPassword', userController.passwordReset);
router.get('/getToken', userController.getToken);
router.post('/updatePassword/:token', userController.updatePassword);

router.post('/verify',userController.verifyAccount);

module.exports = router;