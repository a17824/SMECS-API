// ===========================
// get the packages we need ==
// ===========================
var express    = require('express');
var app        = express();

var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var cors       = require('cors');

var config     = require('./config'); // get our config file

// ROUTES ==============
var routes = require('./routes/routes');
// end of ROUTES ==============

// configuration =========
mongoose.Promise = require('bluebird');
mongoose.connect(config.database, { useMongoClient: true }); // connect to database
app.set('secret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

// use morgan to log requests to the console
app.use(morgan('dev'));

// use cors
app.use(cors());

app.use('/', routes);
// END OF configuration

// server ================
var port = process.env.PORT || 3001;
app.listen(port);
// END OF server==========

module.exports = app;