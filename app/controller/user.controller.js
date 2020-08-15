var userService = require('../services/user.service')

exports.userCreate = (req, res) => {
    try {
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
    } catch (error) {
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


exports.getToken = (req, res) => {
    userService.getToken(req, res)
}


exports.login = function (req, res) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    } else {
        userService.login(req, res);
    }
}


exports.updatePassword = (req, res) => {
    /**
     * check valid password or not
     */
    req.assert('password', 'Password must be at least 4 charter long').len(4);

    var errors = req.validationErrors();
    /**
     * if any error found it will throw error
     */
    if (errors) {
        return res.status(400).send(errors);
    } else {
        userService.updatePassword(req, res);
    }
}


exports.confirmAccount = (req, res) => {
    userService.confirmAccount(req, res)
}

exports.verifyAccount = (req, res) =>{
    userService.verifyAccount(req, res)
}