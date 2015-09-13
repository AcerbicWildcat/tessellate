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
  var imageRouter = express.Router({mergeParams: true});
  var eventRouter  = express.Router({mergeParams: true});
  var mapRouter = express.Router({mergeParams: true});
  var userRouter = express.Router({mergeParams: true});


  // app.engine('html', require('ejs').renderFile);
  // app.set('view engine', 'html');

  app.use(morgan('dev'));
  // app.use(cookieParser()); // read cookies (for future auth)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // set up sessions and initialize passport
  app.use(session({
    secret: app.config.sessionSecret,
    cookie: {expires: false} 
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // files in /client/public/ will be served as static assets
  app.use(express.static(__dirname + '/../public/'));

  var isAuth = function (req, res, next){
    if (!req.isAuthenticated() && !req.headers.facebookid){
      res.send(401);
    } else {
      next();
    }
  };
  /**
   * route paths
   *
   * Using plural and singular - semantics are debatable, putting both in
   * 
   */

  app.use('/events/:eventId/images', isAuth, imageRouter);
  app.use('/events/:eventId/map', isAuth, mapRouter);

  app.use('/event/:eventId/image', isAuth, imageRouter);
  app.use('/event/:eventId/map', isAuth, mapRouter);

  app.use('/events/', isAuth, eventRouter);
  app.use('/event/', isAuth, eventRouter);

  app.use('/user', userRouter);

  //use error handling methods from helpers
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  //attach routes to routers
  require('../modules/event/eventRoutes')(eventRouter);
  require('../modules/map/mapRoutes')(mapRouter);
  require('../modules/user/userRoutes')(userRouter);
  require('../modules/auth/auth-routes')(app, passport);

};