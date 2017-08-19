//Dependencies
var models = require('./../../models');
var saveAlert = require('./4.saveAlert.js');
var async = require("async");

/**
 * middleware for Express.
 *
 * This middleware will run all functions related to sending alerts
 *
 */

module.exports.sendAlert = function(req, res, alert) {
    console.log('SEND ALERT FUNCTION');

    var alertToUpdate1 = alert._id;
    var alertNameID = alert.alertNameID; //

    if(alert.testModeON){
        var typeAclAlert = 'AclAlertsTest';
    } else{
        var typeAclAlert = 'AclAlertsReal';
    }

    //retrieve all checkboxes that have an "s" and are "true" and put them in array
    var arrayRoleID = []; //scope ID
    var arrayRoleName = []; //scope ID
    var stream = models[typeAclAlert].find({'alertID': alertNameID, 'checkBoxID': /s/i, 'checkBoxValue': true}).stream(); //checkboxes that have an "s" and are "true" and put them in array
    stream.on('data', function (doc) {
        arrayRoleID.push(doc.roleGroupID);
        arrayRoleName.push(doc.roleGroupName);
    }).on('error', function (err) {
        // handle the error
    }).on('close', function () {
        // the stream is closed............end of retrieve all checkboxes that have an "s" and are "true" and put them in array

        if (!arrayRoleID || !arrayRoleName) {
            req.flash('error_messages', 'No people on this scope to send this alert.');
            //return res.redirect('/alerts/sending/chooseAlert');
            res.send({redirect: '/dashboard/'});
        }
        else {
            async.waterfall([
                function(callback) {
                    var allUsers = [];
                    for (var i=0; i < arrayRoleID.length;i++){
                        models.Users.find({'userRoleID': arrayRoleID[i], 'softDeleted': null}, function (err, users) {
                            //console.log(users);
                            //console.log('users tamanho ' + users.length);
                            for (var u=0; u < users.length;u++){
                                allUsers.push(users[u].firstName + ' ' + users[u].lastName) ;
                                callback(null, allUsers);

                                console.log('AQUI ENVIA OS ALERTAS PARAR TODA A GENTE DENTRO DESTE SCOPE. NOME: ' + users[u].firstName + ' ' + users[u].lastName);
                            }
                        });
                    }
                    console.log('Alert Sent to roleID = ' + arrayRoleID);
                    console.log('Alert Sent to roleName = ' + arrayRoleName);
                },
                function(arg1, callback){
                    //console.log('BBBBBBBBBBBBBBBBBBBBBBB');
                    // arg1 now equals 'allUsers'
                    var completeUsersArray = arg1; //
                    callback(null, completeUsersArray);
                }
            ], function(err, result) {
                //console.log('CCCCCCCCCCCCCCCCCCCCCCC');
                //copy info from AlertSentTemp to AlertSentInfo and also fills another fields of AlertSentInfo
                models.AlertSentTemp.findById(alertToUpdate1,function(error, tempAlert) {
                    if (!tempAlert) {
                        console.log(err);
                        console.log('TTL EXPIRED');
                        req.flash('error_messages', 'Alert expired. After choosing alert, you have 10min to fill info and send alert');
                        //return res.redirect('/alerts/sending/chooseAlert');
                        res.send({redirect: '/alerts/sending/chooseAlert/'});
                    }
                    else {
                        saveAlert.saveAlertInfo(req, res, tempAlert, arrayRoleName, result);
                    }
                });
            });

        }
    });
};


module.exports.sendAlertRequestAssistance = function(utilityName) {
    models.Utilities.findOne({'utilityName': utilityName}, function(err, users){
        for (var i=0; i < users.smecsUsers.length; i++ ){
            console.log('AQUI ENVIA SMECS REQUEST ASSISTANCE ALERT PARA: ' + users.smecsUsers[i])
        }

    });

};