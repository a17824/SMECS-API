
var models = require('./../models/models');


var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');



module.exports.forgotPost = function (req, res) {
    // find user by email address
    models.Users.findOne({
        email: req.body.email
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            var options = {
                service: 'gmail',
                auth: {
                    user: 'pdcpadr@gmail.com',
                    pass: '123pdcpadr'
                }
            };
            var transporter = nodemailer.createTransport(smtpTransport(options));

            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            transporter.sendMail(mailOptions, function (err) {
            });

            res.json({
                success: true,
                message: 'Email sent',
                email: user.email
            });
        };
    });
}
