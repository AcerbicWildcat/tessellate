//Get the environment variables. If on production, fail silently
require('dotenv').config({silent: true});

var express  = require('express'),
    morgan   = require('morgan'),
    passport = require('passport');

var app = express();

//set config from .env file, environment variables for production
app.config = require(__dirname + '/config/config');

// configure our server with all the middleware and and routing
require('./config/middleware.js')(app, express);
require('./config/passport.js')(passport);

//========================
// start app
//========================

// startup our app
app.listen(app.config.port);

console.log('Server currently chillin on port ' + app.config.port);

// export for testing and flexibility
module.exports = app;
