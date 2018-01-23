/**
 * Created by Banshee on 10/13/2017.
 */
var models = require('./../models/models');

// route to return all users (GET http://localhost:8080/api/users)
module.exports.usersGet = function(req, res) {
    models.Users.find({}, function (err, users) {
        res.json(users);
    });
};