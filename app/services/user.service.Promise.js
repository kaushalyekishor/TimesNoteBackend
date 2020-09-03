var crpto = require('crypto');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var eventEmitter = require('../events/event');

//models
var User = require('../model/user.model');
var Token = require('../model/token.model');
const { LOADIPHLPAPI } = require('dns');
//var userController = require('../controller/user.controller');
//var userService = require('../services/user.service');
//const { resolve } = require('dns');
//const { rejects } = require('assert');
//const { findOne } = require('../model/user.model');
//const { request } = require('http');
//const { Promise } = require('mongoose');

exports.createUser = function(req, res) {
    console.log("test");
    return new Promise((resolve, reject) => {
        try {
            console.log(req.body.email);
            var userExist = User.findOne({ email: req.body.email })
            console.log("user test");
            if (!userExist) {
                reject(userExist);
                console.log("userExist");
            }
            else {
                console.log("user not Exist");
                var user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    isActive: true,
                    isDelete: false
                })
            }
            
            console.log("resolve");
            console.log(user);
            resolve(user);
        } catch (error) {
            console.log(reject(error));
        }
    })
        .then((user) => {
            return new Promise((resolve, reject) => {
                try {
                    console.log("password");
                    console.log(req.body.password);
                    bcrypt.hash(req.body.password, bcrypt.genSalt(10), null,async function (err, hash) {
                        console.log("after password");
                        if (err) {
                            console.log("password error");
                            reject(error);
                        }
                        else {
                            console.log("password matched");
                            user.password = hash
                            var userResponse =await User.create(user);
                            resolve(user);
                        }
                    })
                } catch (error) {
                    console.log(reject(error));
                }
            })
        })
        .then((user) => {
            return new Promise((resolve, reject) => {
                try {
                    var token = new Token({
                        _userId: userResponse._id,
                        token: crypto.randomBytes(16).toString('hex')
                    });

                    token.save(function (err) {
                        if (err) {
                            reject(error);
                        }
                        else {
                            let subject = 'Account verification token';
                            //text = token.token
                            let text = 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 'localhost:4200' + '\/verify\/' + token.token + '\n';
                            //eventEmitter.emit('sendEmail', subject, user, text);
                            eventEmitter.emit('sendEmail', subject, user, text);
                            resolve(user);
                        }
                    })
                    res.send({
                        status: userResponse.name + ' registered'
                    })
                } catch (error) {
                    console.log(reject(error));
                }
            })
        })
}
//module.exports = userService;