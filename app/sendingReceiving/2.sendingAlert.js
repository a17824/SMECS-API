//Dependencies
var models = require('./../models/models');
var async = require("async");


//          FLOOR           \\
module.exports.floorGet = function(req, res) {
    console.log('FLOOR GET ----------------------------------------------------');
    async.parallel([
        function(callback){
            models.AlertSentTemp.findById(req.params.id).exec(callback);
        },
        function(callback){
            models.Floors.find().sort({"floorID":1}).exec(callback);
        }
    ],function(err, results){
        if (results[0] != null) {
            res.json({
                success: true,
                title: results[0].alertName,
                testModeON: results[0].testModeON,
                floor: results[1]
            });
        }
        else {
            res.json({
                success: false,
                redirect: 'home'
            });
        }
    });
};
module.exports.floorPost = function(req, res) {
    console.log('FLOOR POST ---------------------------------------------------------');
    var alertToUpdate1 = req.body._id;
    var floorID = req.body.floorID;
    var floorName = req.body.floorName;
    var floorPhoto = req.body.floorPhoto;

    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, alert) {
        if (!alert) {
            console.log('TTL EXPIRED');
            res.json({
                success: false,
                message: 'timed out',
                redirect: 'home'
            });
        }
        else {
            //if user skip floor question or if floor photo don't exist on database or all/none/multiple/outside floor selected
            if ( floorID == null ||
                floorPhoto === '' ||
                floorID == 'allFloors' ||
                floorID == 'multipleLocations' ||
                floorID == 'outside' ) {

                //checkFloorPhotoExists---------------------
                if (floorName == '' || !floorName){    //if user skip floor question
                    floorPhoto = 'user skipped floor';
                    floorName = 'user skipped floor';
                }

                if (floorPhoto == ''){ //if floor photo don't exist on database
                    floorPhoto = 'FloorPhotoNotExist';
                }

                if (floorID == 'allFloors'){ //if ANY FLOOR/ALL EXIT FLOORS are selected (for 'evacuation exit' of EVACUATE Alert)
                    floorPhoto = 'Multiple floors';
                }
                if (floorID == 'multipleLocations'){ //if Multiple Locations are selected (Violence Alert)
                    floorPhoto = 'Multiple Locations';
                }
                if (floorID == 'outside'){ //if Multiple Locations are selected (Violence Alert)
                    floorPhoto = 'Outside Building';
                }
                //---------------end of checkFloorPhotoExists
                alert.floorName = floorName;
                alert.floorPhoto = floorPhoto;
                alert.save();

                var redirect;

                if (alert.alertNameID == 2 ||
                    alert.alertNameID == 4 ||
                    alert.alertNameID == 5 ||
                    alert.alertNameID == 6 ||
                    alert.alertNameID == 7 ||
                    alert.alertNameID == 9 ||
                    alert.alertNameID == 10 ||
                    alert.alertNameID == 11 ||
                    alert.alertNameID == 14 ||
                    alert.alertNameID == 15 ||
                    alert.alertNameID == 16 ||
                    alert.alertNameID == 17 ||
                    alert.alertNameID == 18 ||
                    alert.alertNameID == 19 ||
                    alert.alertNameID == 23 ||
                    alert.alertNameID == 26 ) {

                    redirect = 'notes';
                }
            }
            //if user choose a floor and photo exists
            else {
                alert.floorID = floorID;
                alert.floorName = floorName;
                alert.floorPhoto = floorPhoto;
                alert.save();

                redirect = 'floorMap';
            }
            res.json({
                success: true,
                redirect: redirect
            });
        }
    });
};

//          FLOOR LOCATION          \\
module.exports.showFloorLocation = function(req, res) {
    console.log('FLOOR GET ----------------------------------------------------');
    async.parallel([
        function(callback){
            models.AlertSentTemp.findById(req.params.id).exec(callback);
        }
    ],function(err, results){
        if (results[0] != null) {
            res.json({
                success: true,
                testModeON: results[0].testModeON,
                title: results[0].alertName,
                floorID: results[0].floorID,
                floorName: results[0].floorName,
                floorPhoto: results[0].floorPhoto
            });
        }
        else {
            res.json({
                success: false,
                redirect: 'home'
            });
        }
    });
};

module.exports.postFloorLocation = function(req, res) {
    var alertToUpdate1 = req.body._id;
    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, alert) {
        if (!alert) {
            console.log('TTL EXPIRED');
            res.json({
                success: false,
                message: 'timed out',
                redirect: 'home'
            });
        }
        else {
            alert.sniperCoordinateX = req.body.coordinateX;
            alert.sniperCoordinateY = req.body.coordinateY;
            alert.save();

            var redirect;

            if (alert.alertNameID == 2 ||
                alert.alertNameID == 4 ||
                alert.alertNameID == 5 ||
                alert.alertNameID == 6 ||
                alert.alertNameID == 7 ||
                alert.alertNameID == 9 ||
                alert.alertNameID == 10 ||
                alert.alertNameID == 11 ||
                alert.alertNameID == 14 ||
                alert.alertNameID == 15 ||
                alert.alertNameID == 16 ||
                alert.alertNameID == 17 ||
                alert.alertNameID == 18 ||
                alert.alertNameID == 19 ||
                alert.alertNameID == 23 ||
                alert.alertNameID == 26 ) {

                redirect = 'notes';
            }
            res.json({
                success: true,
                redirect: redirect
            });
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
        if (results[0] != null) {
            res.json({
                success: true,
                testModeON: results[0].testModeON,
                title: results[0].alertName,
                placeholderNote: results[0].placeholderNote,
                placeholderMissingChildLastPlaceSeen: results[0].placeholderMissingChildLastPlaceSeen,
                placeholderMissingChildClothesWearing: results[0].placeholderMissingChildClothesWearing,
                placeholderStudentWithGunSeated: results[0].placeholderStudentWithGunSeated,
                placeholderStudentWithGunBehaviour: results[0].placeholderStudentWithGunBehaviour,
                placeholderEvacuateWhereTo: results[0].placeholderEvacuateWhereTo
            });
        }
        else {
            res.json({
                success: false,
                redirect: 'home'
            });
        }
    });
};
module.exports.postNotes = function(req, res) {
    console.log('NOTES POST ---------------------------------------------------------');
    var alertToUpdate1 = req.body._id;
    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, alert) {
        if (!alert) {
            console.log('TTL EXPIRED');
            res.json({
                success: false,
                message: 'timed out',
                redirect: 'home'
            });
        }
        else {
            alert.note = req.body.note;

            var redirect;

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
                alert.alertNameID == 19 ||
                alert.alertNameID == 20 ||
                alert.alertNameID == 21 ||
                alert.alertNameID == 22 ||
                alert.alertNameID == 23 ) {

                alert.save();
                redirect = 'summary';
            }
            if (alert.alertNameID == 4 ) {

                alert.missingChildLastTimeSeen = req.body.lastTimeSeen;
                alert.missingChildLastPlaceSeen = req.body.lastPlaceSeen;
                alert.missingChildClothesWearing = req.body.clothesWearing;
                alert.save();
                redirect = 'summary';
            }
            if (alert.alertNameID == 5 ) {

                alert.studentWithGunSeated = req.body.seat;
                alert.studentWithGunBehaviour = req.body.studentBehaviour;
                alert.save();
                redirect = 'floor';
            }
            if (alert.alertNameID == 7 ) {

                alert.evacuateWhereTo = req.body.whereToEvacuate;
                alert.save();
                redirect = 'summary';
            }
            if (alert.alertNameID == 26 ) {

                alert.save();
                redirect = 'multiSelection';

            }
            res.json({
                success: true,
                redirect: redirect
            });
        }
    });
};

//          STUDENT           \\
module.exports.showStudent = function(req, res) {
    async.parallel([
        function(callback){
            models.AlertSentTemp.findById(req.params.id).exec(callback);
        },
        function(callback){
            models.Students.find().exec(callback);
        }
    ],function(err, results){
        if (results[0] != null) {
            res.json({
                success: true,
                testModeON: results[0].testModeON,
                title: results[0].alertName,
                student: results[1]
            });
        }
        else {
            res.json({
                success: false,
                redirect: 'home'
            });
        }
    });
};

module.exports.postStudent = function(req, res) {
    var alertToUpdate1 = req.body._id;
    var studentName = req.body.student;
    var studentPhoto = req.body.photo;

    //checkStudentPhotoExists------------------
    if (studentPhoto == ''){  //if student photo don't exist on database
        studentPhoto = 'photoNotAvailable.bmp';
    }
    //---------- end of checkStudentPhotoExists

    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, alert) {
        if (!alert) {
            console.log('TTL EXPIRED');
            res.json({
                success: false,
                message: 'timed out',
                redirect: 'home'
            });
        }
        else {
            var redirect;

            //ALERT Missing Child,Student with a Gun, Suspected Drug/Alcohol use, Suicide Threat
            if (alert.alertNameID == 4 ||
                alert.alertNameID == 5 ||
                alert.alertNameID == 16 ||
                alert.alertNameID == 17 ||
                alert.alertNameID == 19 ) {

                alert.studentName = studentName;
                alert.studentPhoto = studentPhoto;
                alert.save();
                redirect = 'notes';
            }
            res.json({
                success: true,
                redirect: redirect
            });
        }
    });
};

//          MULTI SELECTION          \\
module.exports.showMultiSelection = function(req, res) {
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
        if (results[0] != null) {
            res.json({
                success: true,
                testModeON: results[0].testModeON,
                title: results[0].alertName,
                utilities: results[1],
                medical: results[2]
            });
        }
        else {
            res.json({
                success: false,
                redirect: 'home'
            });
        }
    });
};

module.exports.postMultiSelection = function(req, res) {
    var alertToUpdate1 = req.body._id;
    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, alert) {
        if (!alert) {
            console.log('TTL EXPIRED');
            res.json({
                success: false,
                message: 'timed out',
                redirect: 'home'
            });
        }
        else {
            alert.multiSelectionNames = req.body.checkboxesNames;
            alert.multiSelectionIDs = req.body.checkboxesIDs;
            alert.save();
            var redirect;

            //ALERT Utilities Failures,
            if (alert.alertNameID == 14 ) {
                redirect = 'floor';
            }
            //ALERT Medical Emergencies
            if (alert.alertNameID == 18 ) {
                alert.medicalInjuredParties = req.body.medicalInjuredParties;
                alert.save();
                redirect = 'floor';
            }
            //ALERT Request Assistance,
            if (alert.alertNameID == 26 ) {
                redirect = 'requestAssintance';
            }
            res.json({
                success: true,
                redirect: redirect
            });
        }
    });
};

//          REQUEST ASSISTANCE          \\
module.exports.showRequestAssistance = function(req, res) {
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
        if (results[0] != null) {
            res.json({
                success: true,
                testModeON: results[0].testModeON,
                title: results[0].alertName,

                infoFloorName: results[0].floorName, // to check later -  dont know exactly what specifc info is needed
                infoMultiSelectionNames: results[0].multiSelectionNames, // to check later -  dont know exactly what specifc info is needed

                info: results[0].floorName,
                floor: results[1],
                utilities: results[2],
                request: results[3],
                alerts: results[4] // check if alert is softDeleted for Utilities Failure
            });
        }
        else {
            res.json({
                success: false,
                redirect: 'requestAssistance'
            });
        }
    })
};

module.exports.postRequestAssistance = function(req, res, next) {
    console.log(' ALERT 26 REQUEST ASSISTANCE POST ---------------------------------------------------------');
    var alertToUpdate1 = req.body._id;
    models.AlertSentTemp.findById({'_id': alertToUpdate1}, function (err, tempAlert) {
        if (!alert) {
            console.log('TTL EXPIRED');
            res.json({
                success: false,
                message: 'timed out',
                redirect: 'home'
            });
        }
        else {
            console.log('tempAlert. = ' + tempAlert.multiSelectionNames );

            /*******
             *
             *  I delete the file that contains code for this alert.
             *  deleted file is:
             *  C:\Users\Banshee\Desktop\to delete\4.toDelete.js
             *
             * *********/

            //saveAlert.saveAlertInfo(req, res, tempAlert);
        }
    });
};