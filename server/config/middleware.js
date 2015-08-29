var morgan        = require('morgan'),
    bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    helpers       = require('./helpers');

module.exports = function (app, express) {

  // FUTURE: router declarations will go here


  app.use(morgan('dev'));
  app.use(cookieParser()); // read cookies (for future auth)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // files in /client/public/ will be served as static assets
  app.use(express.static(__dirname + '/../../client/public'));

  // FUTURE: setup use routes here

  // use error handling methods from helpers
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // FUTURE: injects routers into route files here

};