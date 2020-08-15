var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
//var eventEmitter = require('event-emitter');

var eventEmitter = require('../events/event');
//var events = require('events').EventEmitter;
//var eventEmitter = new events();
//models
var User = require('../model/user.model');
var Token = require('../model/token.model');
const { use } = require('../routes/user.route');

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
                let subject = 'Account verification token';
                //text = token.token
                let text = 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 'localhost:4200' + '\/verify\/' + token.token + '\n';
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


exports.login = async function (req, res) {
    try {
        /**
         * check user Exist or Not
         */
        var userExist = await User.findOne({
            email: req.body.email
        })

        /**
         * if user Exist then compare user password & encrypted database password
         */
        if (userExist) {
            if (bcrypt.compareSync(req.body.password, userExist.password)) {
                if (!userExist.isVerified) {
                    return res.status(400).send({
                        message: 'User is not varified'
                    })
                }
                const payload = {
                    _id: userExist._id,
                    email: userExist.email,
                    name: userExist.name
                }
                console.log(payload);
                /**
                 * create JWT Token
                 */
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 60000
                })
                
                res.json({ user_id: userExist._id, token: token });
            }
            else {
                return res.status(401).send({
                    message: "wrong password please check"
                })
            }

        }
        else {
            return res.status(401).send({
                message: 'Invalid user email address please check'
            })
        }
    } catch (err) {
        res.send(err)
    }
}



exports.updatePassword = async (req, res) => {
    /**
     * find token object present in Database
     */
    var userToken = await Token.findOne({
        token: req.params.token
    })
    /**
     * if user token Exist then find user Exist or Not through user id
     */
    if (userToken) {
        var user = await User.findOne({
            _id: userToken._userId
        })
        if (user) {
            await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10), null, async function (err, hash) {
                if (err) {
                    throw err
                }
                else {
                    user.password = hash
                }
            })
            user.save(function (err) {
                if (err) {
                    return res.status(500).send({
                        message: 'something went wrong'
                    })
                } else {
                    return res.status(200).send({
                        message: 'password reset successfully '
                    })
                }
            })

        } else {
            res.status(401).send({
                message: 'user does not exist'
            })
        }
    }
}

exports.confirmAccount = async function (req, res) {
    /**
     * get Token object from databse
     */
    var tokenData = await Token.findOne({ token: req.params.token })
    if (!tokenData) {
        return res.send({
            message: 'invalid token passed'
        })
    }
    /**
     * get User object from database
     */
    var userData = await User.findOne({
        _id: tokenData._userId
    })
    /**
     * check user exist or not
     */
    if (!userData) {
        return res.status(401).send({
            message: 'User does not exist, may be account is deleted'
        })
    }

    if (userData.isVerified) {
        return res.send({
            message: 'User is already verified'
        })
    }

    userData.isVerified = true
    userData.save()
        .then((resForVerify) => {
            return res.send({
                message: 'Account Successfully verified'
            })
        })
        .catch(err => {
            return res.send(err)
        })
}


exports.getToken = async (req, res) => {
    /**
     * find user in databse 
     */
    User.findOne({
        email: req.body.email
    })
        .then(async userExist => {
            if (!userExist) {
                return res.status(401).send({
                    message: 'Email id does not Exist, PLease enter Valid email id'
                });
            }
            //  Token.findOne({_userId: userExist._id})
            // .then(token =>{

            var token = await new Token({
                _userId: userExist._id,
                token: crypto.randomBytes(16).toString('hex')
            });
            /**
             * creating the record of token in database
             * if it is successful event is triggered to send email
             */
            await token.save(async function (err) {
                if (err) {
                    res.status(500).send({
                        message: err.message
                    });
                }
                else {
                    let subject = 'Account verification token';
                    text = 'reset password token :' + token.token
                    eventEmitter.emit('sendEmail', subject, userExist, text);
                }
            })
            res.send({
                status: 'congrats ' + userExist.name + '!, the reset password token has been sent to your email id'
            })

        })
}


exports.verifyAccount = async function(req, res){
        try {
          /**
           * Checks whether token is present with respective to user
           */
          //console.log(req.body.token);
          Token.findOne({ token: req.body.token }, function (err, token) {
            if (!token) {
              return res.status(400).send({
                type: "not-verified",
                msg:
                  "We are unable to find valid token, your token may have been expired.",
              });
            }
      
            User.findOne(
              {
                email: req.body.email,
                _id: token._userId,
              },
              function (err, user) {
                if (!user) {
                  return res
                    .status(400)
                    .send({ msg: "We are unable to find the user for this token" });
                }
                if (user.isVerified) {
                  return res.status(400).send({
                    type: "already verified",
                    msg: "User is already verified.",
                  });
                }
      
                user.isVerified = true;
                user.save(function (err) {
                  if (err) {
                    return res.status(500).send({ msg: err.message });
                  }
              
      
                  res.status(200).send({
                      message:'Account has been verified please login.'
                    });
                });
              }
            );
          });
        } catch (error) {
          res.send(error);
        }
      };
