var express = require('express');
var router = express.Router();

var login = require('./../app/authenticate/login');
var forgot = require('./../app/authenticate/forgot');

var chooseAlert = require('./../app/sendingReceiving/1.chooseAlert.js');
var sendingAlert = require('./../app/sendingReceiving/2.sendingAlert.js');
var reviewAlert = require('./../app/sendingReceiving/3.reviewAlert.js');

var users = require('./../app/authenticate/toDelete'); //para apagar
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
router.post('/sending/summary', auth.auth, reviewAlert.postReviewAlert, function(req, res) {});

router.get('/public/photosStudents/:file', reviewAlert.photosStudents, function(req, res) {});
router.get('/public/floorPlans/:file', reviewAlert.floorPlans, function(req, res) {});

/* TO  DELETE ---------------------- */
router.get('/users', auth.auth, users.usersGet, function(req, res) {});

module.exports = router;