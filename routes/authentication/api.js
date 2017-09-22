//Dependencies
var express = require('express');
var bcrypt = require('bcryptjs');
var csrf = require('csurf');
var models = require('./../models');
var router = express.Router();

router.use(csrf());

/**
 * Render the login page.
 */
router.get('/api', function (req, res) {
    res.render('api', { title: 'SMECS Login', error: "", csrfToken: req.csrfToken() }); // add this at api.ejs: <input type="hidden" name="_csrf" value="<%= csrfToken %>">
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
                    res.render('api', { error: "ERROR: Incorrect email or pin.", csrfToken: req.csrfToken() });
                } else {
                    if (bcrypt.compareSync(req.body.pin, utilityUser.pin)) {
                        req.session.user = utilityUser;
                        res.redirect('/reports/requestAssistance');
                    } else {
                        res.render('api', { error: "ERROR: Incorrect email or pin.", csrfToken: req.csrfToken() });
                    }
                }
            });
            //END OF checks for users in UtilityUsers database
        } else {
            if (bcrypt.compareSync(req.body.pin, user.pin)) {
                req.session.user = user;
                res.status(200);
                res.end();
            } else {
                res.render('api', { error: "ERROR: Incorrect email or pin.", csrfToken: req.csrfToken() });
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