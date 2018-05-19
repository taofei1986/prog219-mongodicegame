var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Add for Database  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// New code that knows mongo and a nice abstraction layer
var mongo =require('mongodb');
var monk =require('monk');
// add a connection string to mlab.com
// not using local db:  
//var db = monk('localhost:27017/nodetest2');
// use our connection string copied from the cloud mongo.
var db = monk('mongodb://bc_taofei:bctaofei1226@ds014648.mlab.com:14648/prog219-chen');

//var db = monk('mongodb://KCFlynn:bcstudent1@ds014658.mlab.com:14658/usercollection');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use('/',express.static(__dirname + '/'));

app.use(logger('dev'));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
