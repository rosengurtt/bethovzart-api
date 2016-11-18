"use strict";
var express = require("express");
var path = require("path");
var favicon = require('serve-favicon');
var logger = require("morgan");
var cookieParser = require("cookie-parser");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const db = require('./models/db');
const routes = require('./routes/index');
const routesApi = require('./app_api/routes/index');
const users = require('./routes/users');
var uglifyJs = require("uglify-js");
var fs = require('fs');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var appClientFiles = [
    'app_client/app.js',
    'app_client/home/home.controller.js',
    'app_client/common/services/songData.service.js',
    'app_client/common/services/songDisplay.service.js',
    'app_client/common/directives/pageHeader/pageHeader.directive.js',
];
var uglified = uglifyJs.minify(appClientFiles, {
    compress: false
});
fs.writeFile('public/angular/bethovzart.min.js', uglified.code, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Script generated and saved: bethovzart.min.js');
    }
});
app.use(logger('dev'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/fonts'));
app.use('/angular', express.static(__dirname + '/public/angular'));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use('/', routes);
app.use('/users', users);
app.use('/api', routesApi);
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
//# sourceMappingURL=app.js.map