// get all the tools we need
var express = require('express');
var bodyParser = require('body-parser');
path = require('path');
var cors = require('cors');
var logger = require('morgan');

var app = express();

// set up our express application
app.use(logger('prod'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

// cors
app.use(cors());

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.all('/api/v1/*', [require('./src/middlewares/validateRequest')]);

// routes
app.use('/', require('./src/routes'));

// Start the server
var port = process.env.PORT || 8081;

// launch
app.listen(port, function(){
    console.log('Gulp is running my app on PORT: ' + port);
});

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
    app.use(function(err, req, res, next){
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
        return;
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
    return;
});

module.exports = app;
