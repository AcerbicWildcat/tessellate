module.exports = function (app, passport) {
  // These are protected resources --> will not be accessible if user
  // is not logged in with facebook

  // Route to test if user is logged in or not
  // var auth = function (req, res, next){
  //   if (!req.isAuthenticated()){
  //     res.send(401);
  //   } else {
  //     next();
  //   }
  // };
  app.get('/loggedin', function (req, res) {
    var verdict = req.isAuthenticated();
    console.log('VERDICT: ', verdict);
    res.send(req.isAuthenticated() ? req.user : '0');
  });
  // Logout of our app
  app.get('/logout', function (req, res){
    req.session.destroy(function (err) {
      req.logout();
      res.end();
      console.log('User after Logout:', req.user);
      // res.redirect('#/');
    });
  });

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  /* FACEBOOK AUTH ROUTES */
  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_friends'] 
    }),
    function (req, res){
      // Request redirected to facebook so this function does not get called
    });

  // On user interaction with facebook login, redirected back to here
  app.get('/auth/facebook/callback', function (req,resp,next){
    passport.authenticate('facebook',{ failureRedirect: "/" },
    function (err, user){
      if (user){
        req.logIn(user, function(err){
          console.log('Err login', err);
        });
      }
      // console.log('USER??', req.user);
      // console.log('session set' + JSON.stringify(user))
      // resp.cookie('facebookToken', JSON.stringify(user), { maxAge: 900000});
      // resp.json({ state: req.isAuthenticated() });
      resp.redirect('/#/events');
      // resp.end();

    })(req,resp,next);
  });
  
};