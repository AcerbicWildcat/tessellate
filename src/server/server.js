var express  = require('express'),
    morgan   = require('morgan');

// set the port
var port = process.env.PORT || 8080;

var app = express();

// configure our server with all the middleware and and routing
require('./config/middleware.js')(app, express);

//========================
// start app
//========================

// startup our app
app.listen(port);

console.log('Server currently chillin on port ' + port);

// export for testing and flexibility
module.exports = app;