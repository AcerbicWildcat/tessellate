var morgan            = require('morgan'),
    bodyParser        = require('body-parser'),
    // multer            = require('multer'),
    // upload            = multer(),
    cookieParser      = require('cookie-parser'),
    session           = require('express-session'),
    helpers           = require('./helpers'),
    multer            = require('multer'),
    passport          = require('passport');

module.exports = function (app, express) {

  //router declarations
  var imageRouter = express.Router();
  var eventRouter  = express.Router();
  var mapRouter = express.Router();
  var userRouter = express.Router();

  // files in /client/public/ will be served as static assets
  app.use(express.static(__dirname + '/../public/'));

  // app.engine('html', require('ejs').renderFile);
  // app.set('view engine', 'html');

  app.use(morgan('dev'));
  app.use(cookieParser()); // read cookies (for future auth)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // set up sessions and initialize passport
  app.use(session({secret: app.config.sessionSecret }));
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * route paths
   *
   * Using plural and singular - semantics are debatable, putting both in
   * 
   */
  app.use('/event/:eventId/image', imageRouter);
  app.use('/event/', eventRouter);
  app.use('/events/:eventId/images', imageRouter);
  app.use('/events/', eventRouter);
  app.use('/user', userRouter);
  app.use('/map', mapRouter);

  //use error handling methods from helpers
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  //attach routes to routers
  require('../modules/image/imageRoutes')(imageRouter);
  require('../modules/event/eventRoutes')(eventRouter);
  require('../modules/map/mapRoutes')(mapRouter);
  require('../modules/user/userRoutes')(userRouter);
  require('../modules/auth/auth-routes')(app, passport);

};