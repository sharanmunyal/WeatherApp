//initialize all the variables and import the node modules
var express = require('express'),
    path = require('path'),
    //logger = require('morgan'),
    consolidate = require('consolidate'),
    dust = require('dustjs-linkedin'),
    routes = require('./routes/index'),
    app = express(),
    env = app.get('env');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('dust',consolidate.dust);
app.set('view engine', 'dust');


app.use(express.static(path.join(__dirname, 'public')));

//due to custom requirement can't leverage morgan logger
app.use(function (req,res,next) {
  console.log("Method: "+ req.method + " Params: " + JSON.stringify(req.query));
  next();
});
app.use('/', routes);

// handle invalid URL and forward to error handler
app.use(function (req, res, next) {
    var errorMessage,
        err;
    if(env === 'development') {
        errorMessage = 'Page Not Found. Kindly use the correct URL.';
    } else {
        errorMessage = 'Website under maintenance. Kindly retry in some time.';
    }
    err = new Error(errorMessage);
    err.status = 404;
    next(err);
});

// error handlers

// Only in the development environment, the error handler will print stacktrace
if (env === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('index', {
            message: err.message,
            error: err
        });
    });
}
else {
  //In production environment the error handler should handle it gracefully
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('index', {
        message: err.message,
        error: {}
    });
  });
}

//set the server port to the one passed in the URL or the default one
app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function () {
  //indicate that the server has started
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
