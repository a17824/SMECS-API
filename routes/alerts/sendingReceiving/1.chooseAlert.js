//Dependencies
var models = require('./../../models');
var async = require("async");
//var aclPermissions = require('./aclPermissions');



/* Choose Alert. -------------------------------*/
module.exports.show = function(req, res) {
    async.parallel([
        function(callback){
            models.Alerts.find().sort({"alertTypeID":1}).sort({"alertID":1}).exec(callback);
        },
        function(callback){
            models.AclAlertsReal.find().exec(callback);
        },
        function(callback){
            models.AclAlertsTest.find().exec(callback);
        }

    ],function(err, results){
        res.render('alerts/sending/chooseAlert',{
            title:'Choose Alert',
            userAuthPrivilegeID: req.user.userPrivilegeID,
            userAuthRoleID: req.user.userRoleID,
            alerts: results[0],
            aclReal: results[1],
            aclTest: results[2]
        });
    })
};

module.exports.showPost = function(req, res) {
    models.Alerts.find({'alertSlugName': req.body.alertSlugName}, function (err, alert) {

        var placeholder;
        if (req.body.alertID == 2){placeholder = 'ex: Stranger is on my classroom and refuses to leave';}
        if (req.body.alertID == 3){placeholder = 'ex: Many people will be working on the corridors. Please follow the procedure for Lockdown';}
        if (req.body.alertID == 4){placeholder = 'ex: Anna said he went to pick food';}
        if (req.body.alertID == 5){placeholder = 'ex: gun is in his pants, left front pocket';}
        if (req.body.alertID == 6){placeholder = 'ex: Corrosives and Flammable spill at lab';}
        if (req.body.alertID == 7){placeholder = 'ex: there is a strange strong smell on the entire building';}
        if (req.body.alertID == 8){placeholder = 'ex: the caller said bomb will detonate in 5 hours';}
        if (req.body.alertID == 9){placeholder = 'ex: bomb is located behind door of classroom 12';}
        if (req.body.alertID == 10){placeholder = 'ex: computer is on fire. Students are safe';}
        if (req.body.alertID == 11){placeholder = 'ex: powder leaking from package';}
        if (req.body.alertID == 12){placeholder = 'ex: SUV crash against us. No students got hurt';}
        if (req.body.alertID == 13){placeholder = 'ex: road power pole broken. Don\'t use any school front door';}
        if (req.body.alertID == 14 || req.body.alertID == 26 ){placeholder = 'ex: water is dark and smells gas on 1 floor';}
        if (req.body.alertID == 15){placeholder = 'ex: gun is under student desk. It\'s first desk of second row';}
        if (req.body.alertID == 16){placeholder = 'ex: student selling drugs in the restroom';}
        if (req.body.alertID == 17){placeholder = 'ex: Mary is saying she saw Tom trying to cut his wrist';}
        if (req.body.alertID == 18){placeholder = 'ex: Emma and Peter felt in stairs. Emma loss consciousness and Peter head is bleeding';}
        if (req.body.alertID == 19){placeholder = 'ex: Charlotte cut her wrist';}
        if (req.body.alertID == 20){placeholder = 'ex: Media are here because of Arthur incident.';}
        if (req.body.alertID == 21){placeholder = 'ex: remember to not touch anything and put yellow tape around area.';}
        if (req.body.alertID == 22){placeholder = 'ex: .';}
        if (req.body.alertID == 23){placeholder = 'ex: Multiple students fighting.';}

        var alertTemp1 = new models.AlertSentTemp({
            alertGroupID: alert[0].alertTypeID,
            alertGroupName: alert[0].alertTypeName,
            alertNameID: req.body.alertID,
            alertName: req.body.alertName,
            alertSlugName: req.body.alertSlugName,
            testModeON: req.body.testModeON,
            request911Call: alert[0].alertRequest911Call,
            whoCanCall911: alert[0].whoCanCall911,
            notePlaceholder: placeholder
        });
        alertTemp1.save();

        if (req.body.alertID == 2 ||
            req.body.alertID == 6 ||
            req.body.alertID == 7 ||
            req.body.alertID == 9 ||
            req.body.alertID == 10 ||
            req.body.alertID == 11 ||
            req.body.alertID == 15 ||
            req.body.alertID == 23 ||
            req.body.alertID == 26 ) {

            return res.send({redirect: '/alerts/sending/floor/' + alertTemp1._id})
        }
        if (req.body.alertID == 3 ||
            req.body.alertID == 8 ||
            req.body.alertID == 12 ||
            req.body.alertID == 13 ||
            req.body.alertID == 20 ||
            req.body.alertID == 21 ||
            req.body.alertID == 22 ) {
            return res.send({redirect: '/alerts/sending/notes/' + alertTemp1._id})
        }
        if (req.body.alertID == 4 ||
            req.body.alertID == 5 ||
            req.body.alertID == 16 ||
            req.body.alertID == 17 ||
            req.body.alertID == 19 ) {

            return res.send({redirect: '/alerts/sending/student/' + alertTemp1._id})
        }
        if (req.body.alertID == 14 ||
            req.body.alertID == 18 ) {

            return res.send({redirect: '/alerts/sending/multiSelection/' + alertTemp1._id})
        }
    });
};
/*-------------------------end of choosing Alerts*/
