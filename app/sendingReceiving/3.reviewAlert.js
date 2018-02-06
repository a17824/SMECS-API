//Dependencies
var async = require("async");
var path = require('path');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var models = require('./../models/models');
var create = require('./saveAlertFunc/3c.createAlertSentInfo.js');
var floor = require('./saveAlertFunc/3a.savefloorFile.js');
var student = require('./saveAlertFunc/3b.student.js');
var config = require('./../../config');
var FCM = require('fcm-node');


module.exports.reviewAlert = function (req, res) {
    console.log(req.params._id);
    models.AlertSentTemp.findById({ '_id': req.params.id }, function (err, results) {
        if (results != null) {
            res.json({
                success: true,
                results: results // check if alert is softDeleted for Utilities Failure
            });
        }
        else {
            res.json({
                success: false,
                message: 'Alert timed out, please try again.',
                redirect: 'home'
            });
        }
    })
};

module.exports.postReviewAlert = function (req, res, next) {
    var alertToUpdate1 = req.body._id;
    async.waterfall([
        function (callback) {
            models.AlertSentTemp.findById({ '_id': alertToUpdate1 }, function (err, tempAlert) {
                //console.log(tempAlert);
                if (!tempAlert) {
                    console.log('TTL EXPIRED');
                    res.json({
                        success: false,
                        message: 'Alert timed out, please try again.',
                        redirect: 'home'
                    });
                }
                else {
                    // Alert that requires FLOOR function
                    if (tempAlert.alertNameID == 2 ||
                        tempAlert.alertNameID == 4 ||
                        tempAlert.alertNameID == 5 ||
                        tempAlert.alertNameID == 6 ||
                        tempAlert.alertNameID == 7 ||
                        tempAlert.alertNameID == 9 ||
                        tempAlert.alertNameID == 10 ||
                        tempAlert.alertNameID == 11 ||
                        tempAlert.alertNameID == 14 ||
                        tempAlert.alertNameID == 15 ||
                        tempAlert.alertNameID == 16 ||
                        tempAlert.alertNameID == 17 ||
                        tempAlert.alertNameID == 18 ||
                        tempAlert.alertNameID == 19 ||
                        tempAlert.alertNameID == 23 ||

                        tempAlert.alertNameID == 26) {

                        floor.saveFloorFile(req, res, tempAlert);

                        if (tempAlert.alertNameID == 26) {
                            /*******
                             *  I delete the file that contains code for this alert. Deleted file is:
                             *  C:\Users\Banshee\Desktop\to delete\4.toDelete.js
                             * *********/
                            //saveAlert.saveRequestAssistance(req, res, next);
                        }
                    }

                    // Alert that requires STUDENT function
                    if (tempAlert.alertNameID == 4 ||
                        tempAlert.alertNameID == 5 ||
                        tempAlert.alertNameID == 16 ||
                        tempAlert.alertNameID == 17 ||
                        tempAlert.alertNameID == 19) {

                        student.saveStudentFile(req, res, tempAlert);
                    }

                    callback(null, tempAlert);
                }
            });
        },
        function (tempAlert, callback) {

            // check header or url parameters or post parameters for token
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            //Decode token
            if (token) {

                // verifies secret and checks exp
                jwt.verify(token, config.secret, function (err, decoded) {
                    if (err) {
                        return res.json({ success: false, message: 'Failed to authenticate token.' });
                    } else {
                        // if everything is good, save to request for use in other routes

                        var firstName = decoded.user.firstName;
                        var lastName = decoded.user.lastName;
                        create.alertSentInfo(req, res, tempAlert, firstName, lastName); //create AlertSentInfo
                    }
                });
            }

            callback(null, tempAlert);
        }

    ], function (err, tempAlert) {
        if (err) {
            console.log(err);
            res.send({ message: 'something went wrong' });
        } else {


            tempAlert.sentUsersScope.forEach(function (users) {
                if (users.userPushToken) {
                    var message = {
                        to: users.userPushToken, // required fill with device token or topics
                        notification: {
                            title: 'Title of your push notification',
                            body: 'Body of your push notification'
                        }
                    };
                    sendPush(message);
                }
            });
            res.json({
                success: true,
                message: 'Alert Successfuly sent.',
                redirect: 'home'
            });

            /********************************
             *                              *
             *  CALL HERE NOTIFICATION API  *
             *                              *
             * *****************************/
        }
    });
};

function sendPush(message) {
    var serverKey = 'AIzaSyAQHCWvoiCkDk_8_Aur1rpUInk-Sx_uilk';
    var fcm = new FCM(serverKey);

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!", err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

module.exports.photosStudents = function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../public/photosStudents/' + req.params.file));
}

module.exports.floorPlans = function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../public/floorPlans/' + req.params.file));
}