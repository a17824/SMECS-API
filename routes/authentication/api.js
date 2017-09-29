//Dependencies
var express = require('express');
var bcrypt = require('bcryptjs');
var models = require('./../models');
var router = express.Router();

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
/**
 * Render the login page.
 */
router.get('/api', function (req, res) {
    //res.render('api', { title: 'SMECS Login', error: "", csrfToken: req.csrfToken() }); // add this at api.ejs: <input type="hidden" name="_csrf" value="<%= csrfToken %>">
    res.json({ message: 'Hello!', csrfToken: req.csrfToken() });
});

/**
 * Log a user into their account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/api', function (req, res) {
    models.Users.findOne({ email: req.body.email }, function (err, user) {
        if (!user || user.softDeleted !== null) {

            //checks for users in UtilityUsers database
            models.UtilityUsers.findOne({ email: req.body.email }, function (err, utilityUser) {
                if (!utilityUser || utilityUser.softDeleted !== null) {
                    res.json({ success: false, error: "ERROR: Incorrect email or pin.", csrfToken: req.csrfToken() });
                } else {
                    if (bcrypt.compareSync(req.body.pin, utilityUser.pin)) {
                        req.session.user = utilityUser;
                        res.redirect('/reports/requestAssistance');
                    } else {
                        res.json({ error: "ERROR: Incorrect email or pin.", csrfToken: req.csrfToken() });
                    }
                }
            });
            //END OF checks for users in UtilityUsers database
        } else {
            if (bcrypt.compareSync(req.body.pin, user.pin)) {
                // if user is found and password is right
                // create a token
                var token = jwt.sign({user}, 'ilovescotchyscotch', {
                    //expiresIn: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            } else {
                res.json({ error: "ERROR: Incorrect email or pin.", csrfToken: req.csrfToken() });
            }
        }
    });
});

/**
 * Log a user out of their account, then redirect them to the home page.
 */
router.get('/logout', function (req, res) {
    req.session.reset();
    res.redirect('/');
});

module.exports = router;