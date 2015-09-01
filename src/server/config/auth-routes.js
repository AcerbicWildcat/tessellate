module.exports = function (app, passport) {
  // Landing Page Route
  app.get('/', isLoggedIn, function (req, res){
    res.render('/../../client/html/enter.html');
  });

  app.get('/login', function (req, res){
    res.render('/../../client/html/login.html');
  });

  app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function (req, res){
      // Request redirected to facebook so this function does not get called
    });

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/login'}),
    function (req, res){
      res.redirect('/');
    });

  app.get('/logout', function (req, res){
    req.logout();
    res.redirect('/login');
  });

  function isLoggedIn (req, res, next){
    if (req.isAuth)
  };
};