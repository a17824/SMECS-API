//Dependencies
var async = require("async");
var formidable = require('formidable');
var util = require('util');
var fs   = require('fs-extra');
var path = require('path');
var bcrypt = require('bcryptjs');
var models = require('./../models');
var moment = require('moment');
var aclPermissions = require('./../acl/aclPermissions');

/* SHOW Active USERS. */
module.exports.show = function(req, res, next) {
    /*
    models.Users.find(function(err, users) {
        //res.json(users);
        res.render('users/showUsers', { title: 'USERS', users: users });
    }).sort({"firstName":1});
*/
    async.parallel([
        function(callback){
            models.Users.find().sort({"firstName":1}).exec(callback);
        },
        function(callback){aclPermissions.showDeletedUsers(req, res, callback);},   //aclPermissions showDeletedUsers
        function(callback){aclPermissions.showUsers(req, res, callback);},          //aclPermissions showUsers
        function(callback){aclPermissions.addUsers(req, res, callback);},           //aclPermissions addUsers
        function(callback){aclPermissions.modifyUsers(req, res, callback);},        //aclPermissions modifyUsers
        function(callback){aclPermissions.deleteUsers(req, res, callback);}         //aclPermissions deleteUsers


    ],function(err, results){
        //console.log(results[2]);
        res.render('users/showUsers',{
            title:'USERS',
            users: results[0],
            userAuthID: req.user.userPrivilegeID,
            aclShowDeletedUsers: results[1], //aclPermissions showDeletedUsers
            aclShowUsers: results[2], //aclPermissions showUsers
            aclAddUsers: results[3], //aclPermissions addUsers
            aclModifyUsers: results[4],  //aclPermissions modifyUsers
            aclDeleteUsers: results[5]  //aclPermissions deleteUsers

        });
    })
};

/* SHOW SoftDeleted USERS. */
module.exports.showSoftDeleted = function(req, res, next) {
    /*
    models.Users.find(function(err, users) {
        res.render('users/deletedUsers', { title: 'Deleted Users', users: users });
    }).sort({"firstName":1});
    */
    async.parallel([
        function(callback){
            models.Users.find().sort({"firstName":1}).exec(callback);
        },
        function(callback){aclPermissions.addUsers(req, res, callback);},   //aclPermissions addUsers
        function(callback){aclPermissions.eraseUsers(req, res, callback);} //aclPermissions eraseUsers

    ],function(err, results){
        //console.log(results[2]);
        res.render('users/deletedUsers',{
            title:'Deleted Users',
            userAuthID: req.user.userPrivilegeID,
            users: results[0],
            aclAddUsers: results[1], //aclPermissions addUsers
            aclEraseUsers: results[2]  //aclPermissions eraseUsers
        });
    })

};
/* ------------ end of SHOW SoftDeleted USERS. */

/* ADD USERS. ---------------------------------------------------*/
module.exports.add = function(req, res) {
    async.parallel([
        function(callback){
            models.Roles2.find().sort({"roleID":1}).exec(callback);
        },
        function(callback){
            models.Privilege.find().sort({"privilegeID":1}).exec(callback);
        },
        function(callback){aclPermissions.addUsers(req, res, callback);} //aclPermissions addUsers
    ],function(err, results){
        //console.log(results[2]);
        res.render('users/addUser',{
            title:'ADD USER',
            userAuthID: req.user.userPrivilegeID,
            roles2: results[0],
            privilege: results[1],
            aclAddUsers: results[2] //aclPermissions addUsers
        });
    })
};

module.exports.addPost = function(req, res) {
    var hash = bcrypt.hashSync(req.body.pin, bcrypt.genSaltSync(10));
    //console.log(req.body.pin, bcrypt.genSaltSync(10));
    //console.log(hash);
    var user1 = new models.Users({
        userRoleID: req.body.userRoleID,
        userRoleName: req.body.userRoleName,
        userPrivilegeID: req.body.userPrivilegeID,
        userPrivilegeName: req.body.userPrivilegeName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        pin: hash, //req.body.pin,
        photo: req.body.photo

    });
    user1.save(function (err) {
        if (err && (err.code === 11000 || err.code === 11001)) {
            return res.status(409).send('showAlert')
        }else{
            return res.send({redirect:'/users/showUsers'})
        }
    });
};
/*-------------------------------------------end of adding user*/

/* UPDATE USERS. ----------------------------------------------------------------------*/
module.exports.update = function(req, res) {
    async.parallel([
        function(callback){
            models.Users.findById(req.params.id).exec(callback);
        },
        function(callback){
            models.Roles2.find().sort({"roleID":1}).exec(callback);
        },
        function(callback){
            models.Privilege.find().sort({"privilegeID":1}).exec(callback);
        },
        function(callback){aclPermissions.modifyUsers(req, res, callback);} //aclPermissions modifyUsers

    ],function(err, results){
        res.render('users/updateUser',{
            title:'UPDATE USER INFO',
            userAuthID: req.user.userPrivilegeID,
            users: results[0],
            roles2: results[1],
            privilege: results[2],
            aclModifyUsers: results[3]  //aclPermissions modifyUsers
        });
    })
};

module.exports.updatePost = function(req, res) {
    var hash = bcrypt.hashSync(req.body.pin, bcrypt.genSaltSync(10));
    var userToUpdate1 = req.body.userToUpdate;
    //console.log(req.body.pin);
    models.Users.findById({'_id': userToUpdate1}, function(err, user){
        user.userRoleID = req.body.userRoleID;
        user.userRoleName = req.body.userRoleName;
        user.userPrivilegeID = req.body.userPrivilegeID;
        user.userPrivilegeName = req.body.userPrivilegeName;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        if (req.body.pin !== "oldPin"){
            user.pin = hash; //req.body.pin;
        }
        user.photo = req.body.photo;
        user.save(function (err) {
            if (err && (err.code === 11000 || err.code === 11001)) {
                console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr");
                return res.status(409).send('showAlert')
            }else{
                console.log("11111111111111111111");
                return res.send({redirect:'/users/showUsers'})
            }
        });
    });
};
/*---------------------------------------------------------------end of update users*/

/* SoftDeleted USERS. */
module.exports.softDelete = function(req, res) {
    var userToSoftDelete = req.params.id;
//console.log(req.body.userRoleID);
    models.Users.findById({'_id': userToSoftDelete}, function(err, user){
        var whoDeleted = req.session.user.firstName + " " + req.session.user.lastName;
        var wrapped = moment(new Date());
        console.log(wrapped.format('YYYY-MM-DD, h:mm:ss a"'));
        console.log(req.session.user.firstName + " " + req.session.user.lastName);
        user.softDeleted = wrapped.format('YYYY-MM-DD, h:mm:ss a') + "  by " + whoDeleted;
        user.save();
        res.redirect('/users/showUsers');
    })
};
/* ------------ end of SoftDeleted USERS. */

/* Restore SoftDeleted USERS. */
module.exports.restoreUser = function(req, res) {
    console.log(req.params.id);
    var userToRestore = req.params.id;

    models.Users.findById({'_id': userToRestore}, function(err, user){
        user.softDeleted = null;
        user.save();
        res.redirect('/users/deletedUsers');
    })
};
/* ------------ end of SoftDeleted USERS. */



/* ERASE USERS. */
module.exports.erase = function(req, res) {
    var userToDelete = req.params.id;
    // delete photo before delete user----------------
    models.Users.findById({'_id': userToDelete}, function(err, user) {
        var newUser = "";
        var photo = user.photo;
        console.log(photo);
        if (photo != newUser) { //delete old photo if exists
            console.log('mmmmmmmm');
            fs.unlinkSync('./public/photosUsers/' + photo);
            console.log('successfully deleted ' + photo);
        }// ------------end delete photo before delete user

        models.Users.remove({'_id': userToDelete}, function(err) {
            //res.send((err === null) ? { msg: 'User not deleted' } : { msg:'error: ' + err });
            res.redirect('/users/deletedUsers');
        });
    })
};
/* ------------ end of DELETE USERS. */

module.exports.showPhoto = function(req, res) {

    models.Users.findById(req.params.id,function(error, user) {
        res.render('users/showPhoto', { title: 'User Photo', users: user });

    });
};

//--ADD or UPDATE user photo -------------------------------------
module.exports.addUpdatePhoto = function (req, res){
// res.writeHead(200, {'Content-Type': 'text/html' });
// var form = '<form action="/users/addPhoto/:id" enctype="multipart/form-data" method="post">Add a title: <input name="title" type="text" /><br><br><input single="single" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form>';
// res.end(form);
/*
    models.Users.findById(req.params.id,function(error, user) {
        res.render('users/addPhoto', { title: 'ADD PHOTO', user: user });
    });
*/

    async.parallel([
        function(callback){
            models.Users.findById(req.params.id).exec(callback);
        },
        function(callback){aclPermissions.modifyUsers(req, res, callback);}   //aclPermissions modifyUsers

    ],function(err, results){
        //console.log(results[2]);
        res.render('users/addPhoto',{
            title:'Add Photo',
            user: results[0],
            aclModifyUsers: results[1] //aclPermissions modifyUsers
        });
    })
};

module.exports.addUpdatePhotoPost = function (req, res){
    var fields =[];
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        console.log(util.inspect({fields: fields, files: files}));
    });

    //save user id from field value to "fields"
    form.on('field', function (field, value) {
        //console.log(field);
        //console.log(value);
        fields[field] = value;

        form.on('end', function(fields, files) {
            /* Temporary location of our uploaded file */
            var temp_path = this.openedFiles[0].path;
            /* The file name of the uploaded file */
            var file_name = this.openedFiles[0].name;
            /* Location where we want to copy the uploaded file */
            var new_location = 'public/photosUsers/';

            if (this.openedFiles[0].name){ // if a file is selected do this
                models.Users.findById({'_id': field}, function(err, user){
                    var oldPhoto = user.photo;
                    var newUser = "";
                    if ((file_name != oldPhoto) && (oldPhoto != newUser )) { //delete old photo if exists
                        fs.unlinkSync(new_location + oldPhoto);
                        console.log('successfully deleted ' + oldPhoto);
                    }
                    //if old photo doesn't exits or has been deleted, save new file
                    fs.copy(temp_path, new_location + file_name, function (err) { // save file
                        if (err) {
                            console.error(err);
                        } else {
                            user.photo = file_name; //save uploaded file name to user.photo
                            user.save()
                            console.log("success! saved " + file_name);
                        }
                        fs.unlink(temp_path, function (err) { //delete file from temp folder (unlink) -------
                            if (err) {
                                //return res.send(500, 'Something went wrong');
                            }
                        });//------------------------------#end - unlink
                        res.redirect('/users/showUsers');
                    })
                });//--------end of user.photo

            } else { // if no file is selected delete temp file
                console.log('no files added');
                //delete file from temp folder-------
                fs.unlink(temp_path, function (err) {
                    if (err) {
                        return res.send(500, 'Something went wrong');
                    }
                });
                //------------------#end - unlink
            }
        });
    });
};
//-----------------------------------------end ADD or CHANGE user photo

// delete user photo------------------
module.exports.deletePhoto = function(req, res) {
    var new_location = 'public/photosUsers/';
    models.Users.findById({'_id': req.params.id}, function(err, user){
        var photoToDelete = user.photo;
        if (fs.existsSync(new_location + photoToDelete)) { //delete old photo if exists
            fs.unlinkSync(new_location + photoToDelete);
            console.log('successfully deleted ' + photoToDelete);
        }
        user.photo = "";
        user.save()
        res.redirect('/users/showUsers');
    });
};
//----------------end delete user photo