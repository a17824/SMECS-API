//Dependencies
var express = require('express');
var bcrypt = require('bcryptjs');
var models = require('./../models/models');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./../../config');

var router = express.Router();

module.exports.loginPost = function(req, res) {
    if(req.body.pushToken){ // run SMECS API
        models.Users.findOne({
            email: req.body.email.toLowerCase()
        }, function (err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                //check if password matches
                if (!bcrypt.compareSync(req.body.pin, user.pin)) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({user: user}, config.secret, {
                        //expiresIn: 1440 // expires in 24 hours
                    });
                    user.pushToken = req.body.pushToken;
                    user.save(function (err) {
                        if (err) {
                            res.json({ success: false, message: 'contact your system administrator. pushToken not saved' });
                        }else{
                            // return the information including token as JSON
                            res.json({
                                success: true,
                                message: 'Welcome aboard!',
                                token: token,
                                userRoleID: user.userRoleID,
                                userRoleName: user.userRoleName,
                                userPrivilegeID: user.userPrivilegeID,
                                userPrivilegeName: user.userPrivilegeName,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email
                            });
                        }
                    });
                }
            }
        });
    }
};

