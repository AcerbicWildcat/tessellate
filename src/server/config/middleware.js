var morgan            = require('morgan'),
    bodyParser        = require('body-parser'),
    // multer            = require('multer'),
    // upload            = multer(),
    cookieParser      = require('cookie-parser'),
    session           = require('express-session'),
    helpers           = require('./helpers'),
    multer            = require('multer'),
    passport          = require('passport');
var upload = multer();

module.exports = function (app, express) {

  //router declarations
  var imageRouter = express.Router();
  var eventRouter  = express.Router();

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

  //route paths
  app.use('/event/', eventRouter);
  app.use('/event/images', imageRouter);

  //use error handling methods from helpers
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  //attach routes to routers
  require('../modules/cloudinary/cloudinary.routes')(imageRouter);
  require('../modules/event/eventRoutes')(eventRouter);
  // require('../modules/auth/auth-routes')(app, passport);

};