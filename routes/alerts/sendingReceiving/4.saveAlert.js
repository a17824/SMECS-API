//Dependencies
var models = require('./../../models');
var mutualElements = require('./saveAlertFunc/mutualElements');
var floor = require('./saveAlertFunc/floor');
var student = require('./saveAlertFunc/student');
var whoReceiveAlert = require('./3.whoReceiveAlert.js');
var email = require('./../../authentication/email.js');
var moment = require('moment');
var saveAlert = require('./4.saveAlert.js');

/**
 * middleware for Express.
 *
 * This middleware will run all functions related to sending alerts
 *
 */

module.exports.saveAlertInfo = function(req, res, tempAlert, arrayRoleName, result, next) {

    mutualElements.saveAlertInfoMutualElements(req, res, tempAlert, arrayRoleName, result);

    // Alert that requires FLOOR function
    if (tempAlert.alertNameID == 2 ||
        tempAlert.alertNameID == 5 ||
        tempAlert.alertNameID == 6 ||
        tempAlert.alertNameID == 7 ||
        tempAlert.alertNameID == 9 ||
        tempAlert.alertNameID == 10 ||
        tempAlert.alertNameID == 11 ||
        tempAlert.alertNameID == 14 ||
        tempAlert.alertNameID == 15 ||
        tempAlert.alertNameID == 18 ||
        tempAlert.alertNameID == 19 ||
        tempAlert.alertNameID == 23 ||
        tempAlert.alertNameID == 26 ) {


        floor.saveAlertInfoFloor(req, res, tempAlert);

        models.AlertSentInfo.findById({'_id': tempAlert._id}, function(error, alertUpdate) {
            if (tempAlert.alertNameID == 7){ //Alert EVACUATE
                alertUpdate.evacuateWhereTo = tempAlert.evacuateWhereTo;
            }
            if (tempAlert.alertNameID == 14 ||
                tempAlert.alertNameID == 18 ||
                tempAlert.alertNameID == 26 ) {
                alertUpdate.multiSelectionNames = tempAlert.multiSelectionNames;
                alertUpdate.multiSelectionIDs = tempAlert.multiSelectionIDs;

            }
            if (tempAlert.alertNameID == 18){ //Alert Medical Emergencies
                alertUpdate.medicalInjuredParties = tempAlert.medicalInjuredParties;
            }
            alertUpdate.save();

            if (tempAlert.alertNameID == 26 ){
                saveAlert.saveRequestAssistance(req, res, next);
            }
        });

    }

    // Alert that requires STUDENT function
    if (tempAlert.alertNameID == 4 ||
        tempAlert.alertNameID == 5 ||
        tempAlert.alertNameID == 16 ||
        tempAlert.alertNameID == 17 ||
        tempAlert.alertNameID == 19) {

        student.saveAlertInfoStudent(req, res, tempAlert);

        if (tempAlert.alertNameID == 4){ //Alert Missing Child
            models.AlertSentInfo.findById({'_id': tempAlert._id}, function(error, alertUpdate) {
                alertUpdate.missingChildLastTimeSeen = tempAlert.missingChildLastTimeSeen;
                alertUpdate.missingChildLastPlaceSeen = tempAlert.missingChildLastPlaceSeen;
                alertUpdate.missingChildClothesWearing = tempAlert.missingChildClothesWearing;
                alertUpdate.save();
            });
        }
        if (tempAlert.alertNameID == 5){ //Alert Student with a Gun
            models.AlertSentInfo.findById({'_id': tempAlert._id}, function(error, alertUpdate) {
                alertUpdate.studentWithGunSeated = tempAlert.studentWithGunSeated;
                alertUpdate.studentWithGunBehaviour = tempAlert.studentWithGunBehaviour;
                alertUpdate.missingChildClothesWearing = tempAlert.clothesWearing;
                alertUpdate.save();
            });
        }
    }


    //--------------------- redirect all alerts less alert 26 --------------------\\
    if (tempAlert.alertNameID !== 26){
        res.send({redirect: '/alerts/receiving/receiveAlert/' + tempAlert._id});
    }
    console.log('SAVED ALERT ' + tempAlert.alertNameID);
};





// Alert Request Assistance(from Utility Failures) (alertID == 14)
module.exports.saveRequestAssistance = function(req, res, next, typeAlertSent) {
    var alertToUpdate1 = req.body.alertToUpdate;
    var smecsContacts, emailContact, callContact;
    if (req.body.raSmecsApp == 'true' || req.body.raEmail == 'true' || req.body.raCall == 'true') {
        models.Utilities.findOne({'utilityID': req.body.utilityID}, function (err, util) {
            if (req.body.raSmecsApp == 'true') {
                smecsContacts = util.smecsUsers;
            }
            if (req.body.raEmail == 'true') {
                emailContact = util.email;
            }
            if (req.body.raCall == 'true') {
                callContact = util.phone;
            }
        });
    }
    models.AlertSentInfo.findById({'_id': alertToUpdate1}, function (err, alert) {
        var stat = alert.status;
        if (!alert || stat == 'closed') {
            console.log(err);
            req.flash('error_messages', 'No Request Assistance can be sent because the status of the alert is \'closed\'. This alert was already closed by the Principal or other user with rights to clear/close Alerts' );
            res.send({redirect: '/alerts/receiving/receiveAlert/' + alertToUpdate1});
        }
        else {
            //ALERT Utilities Failures Request Assistance,
            var utilityName = req.body.utilityName;
            alert.askedForAssistance = true;
            alert.save();
            var wrapped = moment(new Date());
            var requestAssistance1 = new models.RequestAssistance({
                idAlert: req.body.alertToUpdate,
                status: stat,
                sentTime: wrapped.format('YYYY-MM-DD, h:mm:ss a'),
                alertNameID: req.body.alertNameID,
                alertName: req.body.alertName,
                utilityID: req.body.utilityID,
                utilityName: req.body.utilityName,
                requestAssistanceSmecsApp: req.body.raSmecsApp,
                requestAssistanceEmail: req.body.raEmail,
                requestAssistanceCall: req.body.raCall,
                smecsContacts: smecsContacts,
                emailContact: emailContact,
                callContact: callContact
            });
            requestAssistance1.save(function (err) {
                if (err && (err.code === 11000 || err.code === 11001)) {
                    return res.status(409).send('showAlert')
                }else{
                    console.log("saved Request Assistance");
                    req.flash('success_messages', '(request successful)' );
                    res.send({redirect: '/alerts/receiving/receiveAlert/' + alertToUpdate1});
                }
            });
            if (req.body.raSmecsApp == 'true'){
                whoReceiveAlert.sendAlertRequestAssistance(utilityName);
                //req.flash('error_messages', '(request successful)' );
            }
            if (req.body.raEmail == 'true'){
                email.sendAlertRequestAssistance(req, utilityName, next);
                //req.flash('error_messages', '(email request sent successfully)' );
            }
            if (req.body.raCall == 'true'){
                //send email function
                models.Utilities.findOne({'utilityName': utilityName}, function(err, utility){
                    console.log('AQUI FAZ CHAMDA REQUEST ASSISTANCE ALERT PARA: ' + utility.phone)
                });
            }
        }
    });
};