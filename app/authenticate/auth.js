//Dependencies
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
const util = require('util');

var models = require('./../models/models');
var config = require('./../../config');


// route middleware to verify a token
module.exports.auth = function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};

// route middleware to verify pin
module.exports.pin = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var email;
    var pushToken = req.body.pushToken;
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            return res.json({
                success: false,
                message: 'Failed to authenticate token.'
            });
        } else {
            console.log(decoded.user.email.toLowerCase());
            email = decoded.user.email;
        }
    });
    models.Users.findOne({'email': email}, function (err, user) {
        if (err) {
            return res.json({
                success: false,
                message: 'Failed to locate user.'
            });
        } else {
            if (pushToken) {
                user.pushToken = req.body.pushToken;
                user.save();
                res.json({
                    success: true,
                    message: 'Push token updated'
                });
            } else {
                if (!bcrypt.compareSync(req.body.pin, user.pin)) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    console.log('Pin OK');
                    next();
                }
            }
        }
    });
};