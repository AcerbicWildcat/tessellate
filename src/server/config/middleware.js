var morgan            = require('morgan'),
    bodyParser        = require('body-parser'),
    cookieParser      = require('cookie-parser'),
    session           = require('express-session'),
    helpers           = require('./helpers'),
    passport          = require('passport');

module.exports = function (app, express) {

  // FUTURE: router declarations will go here


  app.use(morgan('dev'));
  app.use(cookieParser()); // read cookies (for future auth)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // set up sessions and initialize passport
  app.use(session({secret: 'tIndEr4KatzsNdDucks'}));
  app.use(passport.initialize());
  app.use(passport.session());
  // files in /client/public/ will be served as static assets
  app.use(express.static(__dirname + '/../../client/public'));

  // FUTURE: setup use routes here

  // use error handling methods from helpers
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // FUTURE: injects routers into route files here
  require('./auth-routes')(app, passport);

};