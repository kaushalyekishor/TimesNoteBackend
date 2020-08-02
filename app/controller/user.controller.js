var userService = require('../services/user.service')

exports.userCreate= (req, res) => {
    try{
        req.assert('name', 'Name cannot be blank').notEmpty();
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('password', 'Password must be at least 4 characters long').len(4);
        req.sanitize('email').normalizeEmail({ remove_dots: false });

        // Check validation errors    
        var errors = req.validationErrors();

        if (errors) {
            return res.status(400).send(errors);
        } else {
        userService.userCreate(req, res);
        }
    }catch(error){
        res.send(error)
    }
}



exports.passwordReset = (req, res) => {
    try {
        /**
         * check valid Email id or Not
         */
        req.assert('email', 'Email is not valid').isEmail();
        req.sanitize('email').normalizeEmail({ remove_dots: false });

        var error = req.validationErrors();
        /**
         * if any error found it will throw error
         */
        if (error) {
            return send(error)
        } else {
            userService.passwordReset(req, res);
        }
    } catch (error) {
        res.send(error)
    }
}