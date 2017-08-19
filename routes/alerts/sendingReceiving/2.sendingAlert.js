//Dependencies
var models = require('./../../models');
var async = require("async");
var whoReceiveAlert = require('./3.whoReceiveAlert.js');
var saveAlert = require('./4.saveAlert.js');

//          FLOOR           \\
module.exports.showFloor = function(req, res) {
    console.log('FLOOR GET ----------------------------------------------------');
    async.parallel([
        function(callback){
            models.AlertSentTemp.findById(req.params.id).exec(callback);
        },
        function(callback){
            models.Floors.find().sort({"floorID":1}).exec(callback);
        }
    ],function(err, results){
        res.render('alerts/sending/floor', {
            title: results[0].alertName,
            userAuthID: req.user.userPrivilegeID,
            alert: results[0],
            floor: results[1]
        });
    });
};
module.exports.postFloor = function(req, res) {
    console.log('FLOOR POST ---------------------------------------------------------');
    var alertToUpdate1 = req.body.alertToUpdate;
    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, alert) {
        if (!alert) {
            console.log(err);
            console.log('TTL EXPIRED');
            req.flash('error_messages', 'Alert expired. After choosing alert, you have 10min to fill info and send alert');
            res.send({redirect: '/alerts/sending/chooseAlert/'});
        }
        else {
            alert.floorID = req.body.floorID;
            alert.floorName = req.body.floorName;
            alert.floorPhoto = req.body.floorPhoto;
            alert.save();
            console.log('saved temp Alert ' + alert.alertName + ' info from FLOOR POST');

            //if user skip floor question or if floor photo don't exist on database or all/none/multiple/outside floor selected
            if ( req.body.floorID == null ||
                req.body.floorPhoto === '' ||
                req.body.floorID == 'allFloors' ||
                req.body.floorID == 'multipleLocations' ||
                req.body.floorID == 'outside' ) {
                if (alert.alertNameID == 2 ||
                    alert.alertNameID == 6 ||
                    alert.alertNameID == 7 ||
                    alert.alertNameID == 9 ||
                    alert.alertNameID == 10 ||
                    alert.alertNameID == 11 ||
                    alert.alertNameID == 14 ||
                    alert.alertNameID == 15 ||
                    alert.alertNameID == 18 ||
                    alert.alertNameID == 23 ||
                    alert.alertNameID == 26 ) {

                    res.send({redirect:'/alerts/sending/notes/' + alertToUpdate1});
                }
                if (alert.alertNameID == 5 ||
                    alert.alertNameID == 19 ) {
                    whoReceiveAlert.sendAlert(req, res, alert);
                }

            }
            else {
                res.send({redirect:'/alerts/sending/floorLocation/' + alertToUpdate1});
            }
        }
    });
};

//          FLOOR LOCATION          \\
module.exports.showFloorLocation = function(req, res) {
    console.log('FLOOR GET ----------------------------------------------------');
    async.parallel([
        function(callback){
            models.AlertSentTemp.findById(req.params.id).exec(callback);
        },
        function(callback){
            models.Floors.find().exec(callback);
        }
    ],function(err, results){
        res.render('alerts/sending/floorLocation', {

            userAuthID: req.user.userPrivilegeID,
            alert: results[0],
            floor: results[1]
        });
    });
};

module.exports.postFloorLocation = function(req, res) {
    console.log('FLOOR LOCATION POST ---------------------------------------------------------');
    var alertToUpdate1 = req.body.alertToUpdate;
    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, alert) {
        if (!alert) {
            console.log(err);
            console.log('TTL EXPIRED');
            req.flash('error_messages', 'Alert expired. After choosing alert, you have 10min to fill info and send alert');
            res.send({redirect: '/alerts/sending/chooseAlert/'});
        }
        else {
            alert.sniperCoordinateX = req.body.coordinateX;
            alert.sniperCoordinateY = req.body.coordinateY;
            alert.save();
            console.log('saved temp Alert ' + alert.alertName + ' info from FLOOR LOCATION POST');

            if (alert.alertNameID == 2 ||
                alert.alertNameID == 6 ||
                alert.alertNameID == 7 ||
                alert.alertNameID == 9 ||
                alert.alertNameID == 10 ||
                alert.alertNameID == 11 ||
                alert.alertNameID == 14 ||
                alert.alertNameID == 15 ||
                alert.alertNameID == 18 ||
                alert.alertNameID == 23 ||
                alert.alertNameID == 26 ) {

                res.send({redirect:'/alerts/sending/notes/' + alertToUpdate1});
            }
            if (alert.alertNameID == 5 ||
                alert.alertNameID == 19 ) {
                whoReceiveAlert.sendAlert(req, res, alert);
            }

        }
    });
};

//          NOTES          \\
module.exports.showNotes = function(req, res) {
    console.log('NOTES GET ----------------------------------------------------');
    async.parallel([
        function(callback){
            models.AlertSentTemp.findById(req.params.id).exec(callback);
        }
    ],function(err, results){
        res.render('alerts/sending/notes', {
            title: results[0].alertName,
            userAuthID: req.user.userPrivilegeID,
            alert: results[0]
        });
    });
};
module.exports.postNotes = function(req, res) {
    console.log('NOTES POST ---------------------------------------------------------');
    var alertToUpdate1 = req.body.alertToUpdate;
    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, alert) {
        if (!alert) {
            console.log(err);
            console.log('TTL EXPIRED');
            req.flash('error_messages', 'Alert expired. After choosing alert, you have 10min to fill info and send alert');
            res.send({redirect: '/alerts/sending/chooseAlert/'});
        }
        else {
            alert.note = req.body.note;

            if (alert.alertNameID == 2 ||
                alert.alertNameID == 3 ||
                alert.alertNameID == 6 ||
                alert.alertNameID == 8 ||
                alert.alertNameID == 9 ||
                alert.alertNameID == 10 ||
                alert.alertNameID == 11 ||
                alert.alertNameID == 12 ||
                alert.alertNameID == 13 ||
                alert.alertNameID == 14 ||
                alert.alertNameID == 15 ||
                alert.alertNameID == 16 ||
                alert.alertNameID == 17 ||
                alert.alertNameID == 18 ||
                alert.alertNameID == 20 ||
                alert.alertNameID == 21 ||
                alert.alertNameID == 22 ||
                alert.alertNameID == 23 ) {

                alert.save();
                whoReceiveAlert.sendAlert(req, res, alert);
            }
            if (alert.alertNameID == 4 ) {

                alert.missingChildLastTimeSeen = req.body.lastTimeSeen;
                alert.missingChildLastPlaceSeen = req.body.lastPlaceSeen;
                alert.missingChildClothesWearing = req.body.clothesWearing;
                alert.save();
                whoReceiveAlert.sendAlert(req, res, alert);
            }
            if (alert.alertNameID == 5 ) {

                alert.studentWithGunSeated = req.body.seat;
                alert.studentWithGunBehaviour = req.body.studentBehaviour;
                alert.save();
                res.send({redirect:'/alerts/sending/floor/' + alertToUpdate1});
            }
            if (alert.alertNameID == 7 ) {

                alert.evacuateWhereTo = req.body.whereToEvacuate;
                alert.save();
                whoReceiveAlert.sendAlert(req, res, alert);
            }
            if (alert.alertNameID == 19 ) {

                alert.save();
                res.send({redirect:'/alerts/sending/floor/' + alertToUpdate1});
            }
            if (alert.alertNameID == 26 ) {
                alert.save();
                res.send({redirect:'/alerts/sending/multiSelection/' + alertToUpdate1});
            }
        }
    });
};

//          STUDENT           \\
module.exports.showStudent = function(req, res) {
    console.log('STUDENT GET ----------------------------------------------------');
    async.parallel([
        function(callback){
            models.AlertSentTemp.findById(req.params.id).exec(callback);
        },
        function(callback){
            models.Students.find().exec(callback);
        }
    ],function(err, results){
        res.render('alerts/sending/student', {
            title: results[0].alertName,
            userAuthID: req.user.userPrivilegeID,
            alert: results[0],
            student: results[1]
        });
    });
};

module.exports.postStudent = function(req, res) {
    console.log('STUDENT POST ---------------------------------------------------------');
    var alertToUpdate1 = req.body.alertToUpdate;
    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, alert) {
        if (!alert) {
            console.log(err);
            console.log('TTL EXPIRED');
            req.flash('error_messages', 'Alert expired. After choosing alert, you have 10min to fill info and send alert');
            res.send({redirect: '/alerts/sending/chooseAlert/'});
        }
        else {
            //ALERT Missing Child,Student with a Gun, Suspected Drug/Alcohol use, Suicide Threat
            if (alert.alertNameID == 4 ||
                alert.alertNameID == 5 ||
                alert.alertNameID == 16 ||
                alert.alertNameID == 17 ||
                alert.alertNameID == 19 ) {

                alert.studentName = req.body.student;
                alert.studentPhoto = req.body.photo;
                alert.save();
                res.send({redirect:'/alerts/sending/notes/' + alertToUpdate1});
            }

        }
    });
};

//          MULTI SELECTION          \\
module.exports.showMultiSelection = function(req, res) {
    console.log(' MULTI SELECTION GET ----------------------------------------------------');
    async.parallel([
        function(callback){
            models.AlertSentTemp.findById(req.params.id).exec(callback);
        },
        function(callback){
            models.Utilities.find().sort({"utilityID":1}).exec(callback);
        },
        function(callback){
            models.Medical.find().sort({"medicalName":1}).exec(callback);
        }
    ],function(err, results){
        res.render('alerts/sending/multiSelection', {
            title: results[0].alertName,
            userAuthID: req.user.userPrivilegeID,
            alert: results[0],
            utilities: results[1],
            medical: results[2]
        });
    });
};

module.exports.postMultiSelection = function(req, res) {
    console.log(' MULTI SELECTION POST ---------------------------------------------------------');
    var alertToUpdate1 = req.body.alertToUpdate;
    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, alert) {
        if (!alert) {
            console.log(err);
            console.log('TTL EXPIRED');
            req.flash('error_messages', 'Alert expired. After choosing alert, you have 10min to fill info and send alert');
            res.send({redirect: '/alerts/sending/chooseAlert/'});
        }
        else {
            alert.multiSelectionNames = req.body.checkboxesNames;
            alert.multiSelectionIDs = req.body.checkboxesIDs;
            alert.save();
            //ALERT Utilities Failures,
            if (alert.alertNameID == 14 ) {
                res.send({redirect:'/alerts/sending/floor/' + alertToUpdate1});
            }
            if (alert.alertNameID == 18 ) {
                alert.medicalInjuredParties = req.body.medicalInjuredParties;
                alert.save();
                res.send({redirect:'/alerts/sending/floor/' + alertToUpdate1});
            }
            //ALERT Request Assistance,
            if (alert.alertNameID == 26 ) {
                res.send({redirect:'/alerts/sending/requestAssistance/' + alertToUpdate1});
            }

        }
    });
};

//          REQUEST ASSISTANCE          \\
module.exports.showRequestAssistance = function(req, res) {
    console.log('SHOW RECEIVE');
    //console.log(req.params);
    //var alertSlugNameAndId = req.params;
    //var alertSlugName = alertSlugNameAndId.alertSlugNameR;

    async.parallel([
        function(callback){
            models.AlertSentTemp.findById(req.params.id).exec(callback);
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
        res.render('alerts/sending/requestAssistance',{
            title: results[0].alertName,
            userAuthID: req.user.userRoleID,
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
    console.log(' ALERT 26 REQUEST ASSISTANCE POST ---------------------------------------------------------');
    var alertToUpdate1 = req.body.alertToUpdate;
    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, tempAlert) {
        if (!tempAlert) {
            console.log(err);
            console.log('TTL EXPIRED');
            req.flash('error_messages', 'Alert expired. After choosing alert, you have 10min to fill info and send alert');
            res.send({redirect: '/alerts/sending/chooseAlert/'});
        }
        else {
            console.log('tempAlert. = ' + tempAlert.multiSelectionNames );
            saveAlert.saveAlertInfo(req, res, tempAlert);
        }
    });
};


