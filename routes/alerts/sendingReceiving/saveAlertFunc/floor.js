//Dependencies
var models = require('./../../../models');
var fs   = require('fs-extra');

/**
 * middleware for Express.
 *
 * This middleware will run all functions related to sending alerts
 *
 */


module.exports.saveAlertInfoFloor = function(req, res, tempAlert) {
    console.log(tempAlert.floorID);
    //checkFloorPhotoExists---------------------
    var floorPhoto = tempAlert._id + '_' + tempAlert.floorPhoto;

    if (tempAlert.floorName == '' || !tempAlert.floorName){    //if user skip floor question
        floorPhoto = '';
        tempAlert.floorName = '';
    }

    if (floorPhoto == tempAlert._id + '_' && tempAlert.floorName !== ''){ //if floor photo don't exist on database
        floorPhoto = 'FloorPhotoNotExist';
    }

    if (tempAlert.floorID == 'allFloors'){ //if ANY FLOOR/ALL EXIT FLOORS are selected (for 'evacuation exit' of EVACUATE Alert)
        console.log(tempAlert.floorID);
        floorPhoto = 'Multiple floors';
    }
    if (tempAlert.floorID == 'multipleLocations'){ //if Multiple Locations are selected (Violence Alert)
        console.log(tempAlert.floorID);
        floorPhoto = 'Multiple Locations';
    }
    if (tempAlert.floorID == 'outside'){ //if Multiple Locations are selected (Violence Alert)
        floorPhoto = 'Outside Building';
    }
    //---------------end of checkFloorPhotoExists

    //saveFloorElements---------------------
    models.AlertSentInfo.findById({'_id': tempAlert._id}, function(error, alertUpdate) {
        alertUpdate.floorName = tempAlert.floorName;
        alertUpdate.floorPhoto = floorPhoto;
        alertUpdate.sniperCoordinateX = tempAlert.sniperCoordinateX;
        alertUpdate.sniperCoordinateY = tempAlert.sniperCoordinateY;
        alertUpdate.save();
    });
    //---------------end of saveFloorElements

    //copy floor Photo from floor database to alertSentInfo database -----------------
    models.Floors.findOne({floorName: tempAlert.floorName}, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (!result || result.floorPlan == '') {
            //console.log(result);
            console.log("No Floor found");
        }
        else {
            var src_location = 'public/floorPlans/';
            var dst_location = 'public/alertSentInfo/floorsPhotos/';
            var src_File_name = result.floorPlan;
            var dst_File_name = tempAlert._id + '_' + result.floorPlan;//file_name + alert ID

            fs.copy(src_location + src_File_name, dst_location + dst_File_name, function (err) { // copy floor file to new directory
                if (err) {
                    console.error(err);
                } else {

                    console.log("success! saved " + result.floorPlan);
                }
            });
        }
    });
    //----------------- end of copy floor Photo from floor database to alertSentInfo database

};

