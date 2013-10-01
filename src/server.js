process.env['ENV'] = process.env['ENV'] || 'local';

//Web server
var express = require('express');

//Config details
var config = require('./../config.js');

//Instance of express
var app = express();
exports.app = app;

var mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient;

//Connection to the database
global.db = MongoClient.db;
MongoClient.connect(config.param('mongo_uri'), function(err, d) {
    if(err) {
        console.log(err);
    } else {
        console.log('Connect to :: ' + d.databaseName);
        global.db = d;
    }
});

//Express middleware
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'Super secret secret'}));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(express.logger());

// support _method (PUT and DELETE in forms)
app.use(express.methodOverride());

//Waiting for the db object to be published on the global window
setTimeout(function() {
    require('./auth').setup(app);
    app.use('/1.0', app.router);
    require('./router')(app);
}, 1000);


//testing code
//written here

var port = config.param('port');
app.listen(port);
console.log('Listening on port ' + port);
