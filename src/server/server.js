var express  = require('express'),
    morgan   = require('morgan'),
    mongoose = require('mongoose'),
    passport = require('passport');

// set the port
var port = process.env.PORT || 8000;

var app = express();

// connect to our database
// mongoose.connect('mongodb://localhost/tessellate');
// mongoose.connection.once('connected', function() {
//   console.log('Connected to database!');
// });

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
