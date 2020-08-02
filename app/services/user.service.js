var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
//var eventEmitter = require('event-emitter');

var events = require('events').EventEmitter;
var eventEmitter = new events();
//models
var User = require('../model/user.model');
var Token = require('../model/token.model');

exports.userCreate = async function (req, res) {
    var userExist = await User.findOne({
        email: req.body.email
    });

    if (userExist) {
        res.send({
            message: 'user alreadt exist, pls try it differesnt email id'
        });
    }

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isActive: true,
        isDelete: false
    })
   
    await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10), null, async function (err, hash) {
        if (err) {
            throw err
        }
        else {
            user.password = hash
        }

        let userResponse = await User.create(user);

        var token = await new Token({
            _userId: userResponse._id,
            token: crypto.randomBytes(16).toString('hex')
        });
        
        await token.save(async function (err) {
            if (err) {
                res.status(500).send({
                    message: err.message
                });
            }
            else {
                console.log(token);
                let subject = 'Account verification token';
                text = token.token
                //let text = 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 'localhost:3000' + '\/confirmation\/' + token.token + '\n';
                //eventEmitter.emit('sendEmail', subject, user, text);
                eventEmitter.emit('sendEmail', subject, user, text);
            }
        })
        res.send({
            status: userResponse.name + ' registered'
        })
    })
        
}

exports.getValidUserById = async function (userId) {
    var user = await User.findOne({
        _id: userId,
        isActive: true,
        isDelete: false
        /*_id: userId,
    isActive: true,
    isDeleted: false*/
    })
    return user;
    }



exports.passwordReset = async function (req, res) {
        try {
            /**
             * find user Exist or Not in Database
             */
            let userExist = await User.findOne({
                email: req.body.email
            })
            /**
             * if user Exist then Generate an token 
             */
            if (userExist) {
                var token = await new Token({
                    _userId: userExist._id,
                    token: crypto.randomBytes(16).toString('hex')
                })
    
                token.save(function (err) {
                    if (err) {
                        return res.status(500).send({
                            message: err.message
                        })
                    }
                    else {
                        let subject = 'Times Note, Please reset your password'
                        text = token.token
                        eventEmitter.emit('sendEmail', subject, userExist, text)
                    }
                })
                res.status(200).send({
                    message: 'reset password Token sent to your email id'
                })
            }
        } catch (error) {
            throw error
        }
    }