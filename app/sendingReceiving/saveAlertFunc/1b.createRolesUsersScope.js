//Dependencies
var models = require('./../../models/models');
var async = require("async");

/**
 * middleware for Express.
 *
 * This middleware will run all functions related to sending alerts
 *
 */
module.exports.getUsersToReceiveAlert = function(req, res, alert) {

    if(alert.testModeON){
        var typeAclAlert = 'AclAlertsTest';
    } else{
        var typeAclAlert = 'AclAlertsReal';
    }

    //retrieve all checkboxes that have an "r" and are "true" and put them in array
    var arrayRoleID = []; //scope ID
    var arrayRoleName = []; //scope Name
    var stream = models[typeAclAlert].find({'alertID': alert.alertNameID, 'checkBoxID': /r/i, 'checkBoxValue': true}).cursor(); //checkboxes that have an "r" and are "true", put them in array
    stream.on('data', function (doc) {
        arrayRoleID.push(doc.roleGroupID); //ROLES that will receive alert
        arrayRoleName.push(doc.roleGroupName);
    }).on('error', function (err) {
        // handle the error
    }).on('close', function () {
        // the stream is closed............end of retrieve all checkboxes that have an "s" and are "true" and put them in array
        if (arrayRoleID.length < 1 || arrayRoleID == null) {
            console.log('No people on this scope to send this alert');
            //res.json({success: false, redirect: 'home'});
        }
        else {
            models.Users.find({'userRoleID': {$in: arrayRoleID}, 'softDeleted': null}, function (err, allUsersToSendAlert) {
                /********************
                 * HERE WE KNOW ALL USERS TO SEND ALERT NOTIFICATION

                 . VAR "allUsersToSendAlert" HAS ALL USERS TO SEND NOTIFICATION
                 *********************/

                //save to AlertSentTemp all ROLES and USERS that will receive alert
                models.AlertSentTemp.findById({'_id': alert._id}, function(error, alertUpdate) {
                    alertUpdate.sentRoleIDScope = [];
                    alertUpdate.sentRoleNameScope = [];
                    console.log('arrayRoleID = ',arrayRoleID);
                    if(error || arrayRoleID == null || arrayRoleName == null){
                        //res.json({success: false, redirect: 'home'});
                    }else {
                        alertUpdate.sentRoleIDScope = arrayRoleID;
                        alertUpdate.sentRoleNameScope = arrayRoleName;

                        var userArray =[];
                        for (var i = 0; i < allUsersToSendAlert.length; i++) {
                            var user = {
                                userFirstName: allUsersToSendAlert[i].firstName,
                                userLastName: allUsersToSendAlert[i].lastName,
                                userEmail: allUsersToSendAlert[i].email,
                                userPushToken: allUsersToSendAlert[i].pushToken,
                                userPhoto: allUsersToSendAlert[i].photo};
                            userArray.push(user);
                            alertUpdate.sentUsersScope = userArray;
                        }
                        alertUpdate.save(function(err, resp) {
                            if (err) {
                                console.log(err);
                                console.log('something went wrong');
                            } else {
                                console.log('the tempAlert has been saved');
                                console.log('alertUpdate.sentRoleIDScope = ',alertUpdate.sentRoleIDScope);
                                console.log('alertUpdate.sentRoleNameScope = ',alertUpdate.sentRoleNameScope);
                                //console.log('alertUpdate.sentUsersScope = ',alertUpdate.sentUsersScope);
                            }
                        });
                    }

                });
                //---------------end of save to AlertSentTemp all ROLES and USERS that will receive alert
            });
        }
    });
};
/*
module.exports.getUsersToReceiveAlert = function(req, res, alert) {

    if(alert.testModeON){
        var typeAclAlert = 'AclAlertsTest';
    } else{
        var typeAclAlert = 'AclAlertsReal';
    }

    //retrieve all checkboxes that have an "r" and are "true" and put them in array
    var arrayRoleID = []; //scope ID
    var arrayRoleName = []; //scope Name
    models[typeAclAlert].find({'alertID': alert.alertNameID, 'checkBoxID': /r/i, 'checkBoxValue': true}, function (err, docs) {

        docs.forEach(function (doc) {
            arrayRoleID.push(doc.roleGroupID);
            arrayRoleName.push(doc.roleGroupName);
        });
        if (arrayRoleID.length < 1 || arrayRoleID == null) {
            console.log('No people on this scope to send this alert');
            res.json({success: false,
                redirect: 'home'});
        }
        else {
            models.Users.find({'userRoleID': {$in: arrayRoleID}, 'softDeleted': null}, function (err, allUsersToSendAlert) {

                //********************
                // * HERE WE KNOW ALL USERS TO SEND ALERT NOTIFICATION
                //
                // . VAR "allUsersToSendAlert" HAS ALL USERS TO SEND NOTIFICATION
                //********************

                //save to AlertSentTemp all ROLES and USERS that will receive alert
                models.AlertSentTemp.findById({'_id': alert._id}, function(error, alertUpdate) {
                    if(error ||
                        alertUpdate.sentRoleIDScope == null ||
                        alertUpdate.sentRoleNameScope == null ||
                        arrayRoleID == null ||
                        arrayRoleName == null){
                        console.log('erro da primeira vez que se escolhe um alerta. Please try again and contact the administrator if this message continues to show');
                        res.json({success: false,
                            redirect: 'home'});
                    }else {
                        alertUpdate.sentRoleIDScope = arrayRoleID;
                        alertUpdate.sentRoleNameScope = arrayRoleName;
                        alertUpdate.sentUsersScope = alertUpdate.sentUsersScope;
                        var userArray = [];
                        for (var i = 0; i < allUsersToSendAlert.length; i++) {
                            var user = {
                                userFirstName: allUsersToSendAlert[i].firstName,
                                userLastName: allUsersToSendAlert[i].lastName,
                                userEmail: allUsersToSendAlert[i].email,
                                userPushToken: allUsersToSendAlert[i].pushToken,
                                userPhoto: allUsersToSendAlert[i].photo
                            };
                            userArray.push(user);
                            alertUpdate.sentUsersScope = userArray;
                        }
                        alertUpdate.save(function (err, resp) {
                            if (err) {
                                console.log(err);
                                console.log('something went wrong');
                            } else {
                                console.log('the tempAlert has been saved');
                            }
                        });
                    }
                });
                //---------------end of save to AlertSentTemp all ROLES and USERS that will receive alert
            });
        }

    }) //checkboxes that have an "r" and are "true", put them in array
};
*/

module.exports.sendAlertRequestAssistance = function(utilityName) {
    models.Utilities.findOne({'utilityName': utilityName}, function(err, users){
        for (var i=0; i < users.smecsUsers.length; i++ ){
            console.log('AQUI ENVIA SMECS REQUEST ASSISTANCE ALERT PARA: ' + users.smecsUsers[i])
        }
    });
};