module.exports = function (app, passport) {

  // Landing Page Route
  app.get('/', function (req, res){
    if (isLoggedIn(req, res)){
      res.redirect('/event');
    } else {
      res.render('pages/home/index');
    }
  });

  app.get('/event', isLoggedIn, function (req, res){
    res.render('pages/event');
  });

  app.get('/event/:eventId', isLoggedIn, function (req, res){
    res.render('pages/event/mosaic');
  });
  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  /* FACEBOOK AUTH ROUTES */
  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function (req, res){
      // Request redirected to facebook so this function does not get called
    });

  // On user interaction with facebook login, redirected back to here
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/event',
      failureRedirect: '/'
    }),
  });

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  // Logout of our app
  app.get('/logout', function (req, res){
    req.logout();
    res.redirect('/');
  });

  /**
   * Intermediary to ensure user is logged in.
   * @param  req
   * @param  res
   * @param  {Function} next
   * @return {Boolean}       app flow continues if next returned (user logged in)
   */
  function isLoggedIn (req, res, next){
    if (req.isAuthenticated()){
      return next();
    } else {
      res.redirect('/');
    }
  };
};