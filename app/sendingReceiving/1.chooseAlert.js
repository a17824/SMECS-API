//Dependencies
var models = require('./../models/models');
var async = require("async");
var whoReceiveAlert = require('./saveAlertFunc/1b.createRolesUsersScope.js');
var buildAlertButtonsArray = require('./saveAlertFunc/1a.createAlertButtonsArray.js');


/* Choose Alert. -------------------------------*/
module.exports.chooseAlertGet = function (req, res) {
    async.parallel([
        function (callback) {
            buildAlertButtonsArray.getRealTestAlerts(req, function (arrayAlerts) {
                callback(null, arrayAlerts);
            });
        }
    ], function (err, results) {
        res.json({
            success: true,
            testModeOnArrayReal: results[0][0],
            testModeOnArrayTest: results[0][1]

        });
    })
};

module.exports.chooseAlertPost = function (req, res) {
    models.Alerts.find({
        'alertID': req.body.alertID
    }, function (err, alert) {

        var
            placeholderNote,
            placeholderMissingChildLastPlaceSeen,
            placeholderMissingChildClothesWearing,
            placeholderStudentWithGunSeated,
            placeholderStudentWithGunBehaviour,
            placeholderEvacuateWhereTo;

        if (req.body.alertID == 2) {
            placeholderNote = 'ex: Stranger is in my classroom';
        }
        if (req.body.alertID == 3) {
            placeholderNote = 'ex: Many people will be working on the corridors. Please follow the procedure for Lockdown';
        }
        if (req.body.alertID == 4) {
            placeholderNote = 'ex: Anna was going to her locker';
            placeholderMissingChildLastPlaceSeen = 'ex: Gym';
            placeholderMissingChildClothesWearing = 'ex: School uniform';
        }
        if (req.body.alertID == 5) {
            placeholderNote = 'ex: Gun is in his front, left pocket';
            placeholderStudentWithGunSeated = 'ex: Second row, second seat from left';
            placeholderStudentWithGunBehaviour = 'ex: Normal';
        }
        if (req.body.alertID == 6) {
            placeholderNote = 'ex: Corrosives and flammable spill at lab';
        }
        if (req.body.alertID == 7) {
            placeholderNote = 'ex: There is a strange strong smell on the entire building';
            placeholderEvacuateWhereTo = 'ex: church';
        }
        if (req.body.alertID == 8) placeholderNote = 'ex: The caller said bomb will detonate in 5 hours';
        if (req.body.alertID == 9) placeholderNote = 'ex: Bomb is located behind door of classroom 12';
        if (req.body.alertID == 10) placeholderNote = 'ex: Computer is on fire. Students are safe';
        if (req.body.alertID == 11) placeholderNote = 'ex: Powder leaking from package';
        if (req.body.alertID == 12) placeholderNote = 'ex: SUV hit school bus. No students got hurt';
        if (req.body.alertID == 13) placeholderNote = 'ex: Road power pole broken. Don\'t use any school front door';
        if (req.body.alertID == 14 || req.body.alertID == 26) placeholderNote = 'ex: water is dark and smells gas on 1st floor';
        if (req.body.alertID == 15) placeholderNote = 'ex: gun is under student desk. It\'s first desk of second row';
        if (req.body.alertID == 16) placeholderNote = 'ex: student selling drugs in the restroom';
        if (req.body.alertID == 17) placeholderNote = 'ex: Mary is saying she saw Tom trying to cut his wrist';
        if (req.body.alertID == 18) placeholderNote = 'ex: Emma and Peter fell in stairs.';
        if (req.body.alertID == 19) placeholderNote = 'ex: Charlotte cut her wrist';
        if (req.body.alertID == 20) placeholderNote = 'ex: Media are here due to incident with a student.';
        if (req.body.alertID == 21) placeholderNote = 'ex: remember to not touch anything and put yellow tape around area.';
        if (req.body.alertID == 22) placeholderNote = 'ex: .';
        if (req.body.alertID == 23) placeholderNote = 'ex: Multiple students fighting.';

        var alertTemp1 = new models.AlertSentTemp({
            alertGroupID: alert[0].alertTypeID,
            alertGroupName: alert[0].alertTypeName,
            alertNameID: req.body.alertID,
            alertName: req.body.alertName,
            testModeON: req.body.testModeON,
            request911Call: alert[0].alertRequest911Call,
            whoCanCall911: alert[0].whoCanCall911,
            placeholderNote: placeholderNote,
            placeholderMissingChildLastPlaceSeen: placeholderMissingChildLastPlaceSeen,
            placeholderMissingChildClothesWearing: placeholderMissingChildClothesWearing,
            placeholderStudentWithGunSeated: placeholderStudentWithGunSeated,
            placeholderStudentWithGunBehaviour: placeholderStudentWithGunBehaviour,
            placeholderEvacuateWhereTo: placeholderEvacuateWhereTo
        });
        alertTemp1.save();

        whoReceiveAlert.getUsersToReceiveAlert(req, res, alertTemp1); //save SCOPES to database

        var redirect;

        if (req.body.alertID == 2 ||
            req.body.alertID == 6 ||
            req.body.alertID == 7 ||
            req.body.alertID == 9 ||
            req.body.alertID == 10 ||
            req.body.alertID == 11 ||
            req.body.alertID == 15 ||
            req.body.alertID == 23 ||
            req.body.alertID == 26) {

            redirect = 'floor';
        }
        if (req.body.alertID == 3 ||
            req.body.alertID == 8 ||
            req.body.alertID == 12 ||
            req.body.alertID == 13 ||
            req.body.alertID == 20 ||
            req.body.alertID == 21 ||
            req.body.alertID == 22) {

            redirect = 'notes';
        }
        if (req.body.alertID == 4 ||
            req.body.alertID == 5 ||
            req.body.alertID == 16 ||
            req.body.alertID == 17 ||
            req.body.alertID == 19) {

            redirect = 'student';
        }
        if (req.body.alertID == 14 ||
            req.body.alertID == 18) {

            redirect = 'multiSelection';
        }
        res.json({
            success: true,
            redirect: redirect,
            _id: alertTemp1._id //to delete. It's only to help with postman

        });
    });
};
/*-------------------------end of choosing Alerts*/