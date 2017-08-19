//Dependencies
var models = require('./../../models');
var async = require("async");
var saveAlert = require('./4.saveAlert.js');


/* RECEIVING */

module.exports.showAlertReceived = function(req, res) {
    console.log('SHOW RECEIVE');
    //console.log(req.params);
    //var alertSlugNameAndId = req.params;
    //var alertSlugName = alertSlugNameAndId.alertSlugNameR;

    async.parallel([
        function(callback){
            models.AlertSentInfo.findById(req.params.id).exec(callback);
        },
        function(callback){
            models.Floors.find().exec(callback);
        },
        function(callback){
            models.Utilities.find().exec(callback);
        },
        function(callback){
            models.RequestAssistance.find().exec(callback);
        },
        function(callback){
            models.Alerts.find().exec(callback);
        },
        function(callback){
            models.AclAlertsReal.find().exec(callback);
        },
        function(callback){
            models.AclAlertsTest.find().exec(callback);
        }

    ],function(err, results){
        res.render('alerts/receiving/receiveAlert',{
            title:'Alert Received',
            userAuthID: req.user.userRoleID,
            userAuthRoleName: req.user.userRoleName,
            info: results[0],
            floor: results[1],
            utilities: results[2],
            request: results[3],
            alerts: results[4], // check if alert is softDeleted for Utilities Failure
            aclReal: results[5], // to check if user has permission to send Request Assistance Alert
            aclTest: results[6] // to check if user has permission to send Request Assistance Alert

        });
    })
};

module.exports.postRequestAssistance = function(req, res, next) {
    console.log(' ALERT 14 REQUEST ASSISTANCE POST ---------------------------------------------------------');
    saveAlert.saveRequestAssistance(req, res, next);
};

