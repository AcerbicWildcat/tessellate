var express  = require('express'),
    morgan   = require('morgan'),
    passport = require('passport');

// set the port
var port = process.env.PORT || 8080;

var app = express();

//set view engine
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');

//use correct config file for development, production
app.config = require(__dirname + '/config/' + (process.env.NODE_ENV || 'development') + '/config');

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
