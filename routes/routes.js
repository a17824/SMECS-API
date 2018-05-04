var express = require('express');
var router = express.Router();

var login = require('./../app/authenticate/login');
var forgot = require('./../app/authenticate/forgot');

var chooseAlert = require('./../app/sendingReceiving/1.chooseAlert.js');
var sendingAlert = require('./../app/sendingReceiving/2.sendingAlert.js');
var reviewAlert = require('./../app/sendingReceiving/3.reviewAlert.js');
var reports = require('./../app/reports/reports.js');

var auth = require('./../app/authenticate/auth');

/* AUTHENTICATE ---------------------- */
router.post('/login', login.loginPost, function(req, res) {});

/* FORGOT PASSWORD ------------------- */
router.post('/forgot', forgot.forgotPost, function(req, res) {});

/* CHOOSE ALERT ---------------------- */
router.get('/chooseAlert', auth.auth, chooseAlert.chooseAlertGet, function(req, res) {});
router.post('/chooseAlert', auth.auth, chooseAlert.chooseAlertPost, function(req, res) {});

/* Send Alert - Floor. -------------------------------*/
router.get('/sending/floor/:id', auth.auth, sendingAlert.floorGet, function(req, res) {});
router.post('/sending/floor', auth.auth, sendingAlert.floorPost, function(req, res) {});

/* Send Alert - FloorLocation. -------------------------------*/
router.get('/sending/floorLocation/:id', auth.auth, sendingAlert.showFloorLocation, function(req, res) {});
router.post('/sending/floorLocation', auth.auth, sendingAlert.postFloorLocation, function(req, res) {});

/* Send Alert - Notes. -------------------------------*/
router.get('/sending/notes/:id', auth.auth, sendingAlert.showNotes, function(req, res) {});
router.post('/sending/notes', auth.auth, sendingAlert.postNotes, function(req, res) {});

/* Send Alert - Student. -------------------------------*/
router.get('/sending/student/:id', auth.auth, sendingAlert.showStudent, function(req, res) {});
router.post('/sending/student', auth.auth, sendingAlert.postStudent, function(req, res) {});

/* Send Alert - MultiSelection. -------------------------------*/
router.get('/sending/multiSelection/:id', auth.auth, sendingAlert.showMultiSelection, function(req, res) {});
router.post('/sending/multiSelection', auth.auth, sendingAlert.postMultiSelection, function(req, res) {});

/* Send Alert - RequestAssistance (ALERT 26). -------------------------------*/
router.get('/sending/requestAssistance/:id', auth.auth, sendingAlert.showRequestAssistance, function(req, res) {});
router.post('/sending/requestAssistance', auth.auth, sendingAlert.postRequestAssistance, function(req, res) {});

/* Send Alert - Summary. -------------------------------*/
router.get('/sending/summary/:id', auth.auth, reviewAlert.reviewAlert, function(req, res) {});
router.post('/sending/summary', auth.auth, auth.pin, reviewAlert.postReviewAlert, function(req, res) {});

/* Update pushToken ------------------------------------*/
router.post('/updatePushToken', auth.auth, auth.pin, function(req, res) {});

/* Get all alerts ------------------------------------*/
router.get('/reports/reportsGet', auth.auth, reports.reportsGet, function(req, res) {});

/* Get details on single alert ------------------------------------*/
router.get('/reports/alertInfo/:id', auth.auth, reports.alertInfoGet, function(req, res) {});

/* Get number of open alerts ------------------------------------*/
router.get('/reports/openAlerts', auth.auth, reports.openAlertsGet, function(req, res) {});

/* Get procedure ------------------------------------*/
router.get('/reports/procedureGet/:id', auth.auth, reports.procedureGet, function(req, res) {});
router.get('/reports/proceduresGet', auth.auth, reports.proceduresGet, function(req, res) {});

/* Post received alert ----------------------------------*/
router.post('/alertReceipt', auth.auth, reports.alertReceiptPost, function(req, res) {});
router.post('/alertViewed', auth.auth, reports.alertViewedPost, function(req, res) {});

router.get('/public/photosStudents/:file', reviewAlert.photosStudents, function(req, res) {});
router.get('/public/floorPlans/:file', reviewAlert.floorPlans, function(req, res) {});

module.exports = router;