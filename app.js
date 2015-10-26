﻿#!/bin/env node

var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var logFile = fs.createWriteStream('./app.log', { flags: 'a' });

var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('port', process.env.PORT || 4010 );
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev', { stream: logFile }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var httpServer = http.createServer(app);

httpServer.listen(app.get('port'), function () {
    console.log('HTTP server listening on port ' + app.get('port'));
    api.setIO(require('socket.io').listen(httpServer, function () { 
        log: true;
    }));
});

httpServer.on('error', function () {
    console.log('HTTP server error');
    process.exit();
});

httpServer.on('close', function () {
    console.log('HTTP server close');
});

process.title = "demo24";

process.on('exit', function () {
    console.log('process end');
});

process.on('uncaughtException', function (err) {
    console.log('process uncaughtException', JSON.stringify(err));
});

process.on('SIGINT', function () {
    console.log('process SIGINT');
    process.exit();
});

process.on('SIGUP', function () {
    console.log('process SIGUP');
    process.exit();
});

process.on('SIGTERM', function () {
    console.log('process SIGTERM');
    process.exit();
});


module.exports = app;

