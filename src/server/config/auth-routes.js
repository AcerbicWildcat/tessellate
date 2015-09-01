module.exports = function (app, passport) {
  // Landing Page Route
  app.get('/', isLoggedIn, function (req, res){
    res.render('/../../client/html/enter.html'); //render site where user can create, join, or modify (if they have an existing event)
  });

  app.get('/login', function (req, res){
    res.render('/../../client/html/login.html');
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
    passport.authenticate('facebook', {failureRedirect: '/login'}),
    function (req, res){
      res.redirect('/');
    });

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  // Logout of our app
  app.get('/logout', function (req, res){
    req.logout();
    res.redirect('/login');
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
      res.redirect('/login');
    }
  };
};