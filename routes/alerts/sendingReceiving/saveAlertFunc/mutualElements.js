//Dependencies
var models = require('./../../../models');
var moment = require('moment');


/**
 * middleware for Express.
 *
 * This middleware will run all functions related to sending alerts
 *
 */

module.exports.saveAlertInfoMutualElements = function(req, res, tempAlert, arrayRoleName, result) {

    var wrapped = moment(new Date());
    if (tempAlert.alertNameID == 26 ) { //Request Repair Assistance
console.log('');
        var alert1 = new models.AlertSentInfo({
            _id: tempAlert._id,
            sentBy: req.session.user.firstName + " " + req.session.user.lastName,
            sentTime: wrapped.format('YYYY-MM-DD, h:mm:ss a'),
            alertGroupID: tempAlert.alertGroupID,
            alertGroupName: tempAlert.alertGroupName,
            alertNameID: tempAlert.alertNameID,
            alertName: tempAlert.alertName,
            request911Call: tempAlert.request911Call,

            note: tempAlert.note,
            testModeON: tempAlert.testModeON


        });
    } else {

        var alert1 = new models.AlertSentInfo({
            _id: tempAlert._id,
            sentBy: req.session.user.firstName + " " + req.session.user.lastName,
            sentTime: wrapped.format('YYYY-MM-DD, h:mm:ss a'),
            alertGroupID: tempAlert.alertGroupID,
            alertGroupName: tempAlert.alertGroupName,
            alertNameID: tempAlert.alertNameID,
            alertName: tempAlert.alertName,
            sentScope: arrayRoleName,
            sentTo: result,
            request911Call: tempAlert.request911Call,
            whoCanCall911: tempAlert.whoCanCall911,
            note: tempAlert.note,
            testModeON: tempAlert.testModeON


        });
    }
    alert1.save();

};


