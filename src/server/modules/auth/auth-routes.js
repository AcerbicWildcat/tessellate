module.exports = function (app, passport) {
  // These are protected resources --> will not be accessible if user
  // is not logged in with facebook
  app.get('/event', isLoggedIn, function (req, res){
    res.render('pages/event');
  });

  app.get('/event/:eventId', isLoggedIn, function (req, res){
    res.render('pages/event/mosaic');
  });

  // Route to test if user is logged in or not
  app.get('/loggedin', function (req, res){
    res.send(req.isAuthenticated() ? req.user : 0);
  });

  // Logout of our app
  app.get('/logout', function (req, res){
    req.logout();
    res.redirect('/');
  });

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  /* FACEBOOK AUTH ROUTES */
  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_friends'], 
      display: 'touch' 
      // response_type: 'token'
    }),
    function (req, res){
      // Request redirected to facebook so this function does not get called
    });

  // On user interaction with facebook login, redirected back to here
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      // successRedirect: '/', //redirect to landing page for now --> will be account/event page once it exists
      failureRedirect: '/'
    }), function (req, res){
      res.end();
  });

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


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
      res.send(401);
      // res.redirect('/');
    }
  };
};