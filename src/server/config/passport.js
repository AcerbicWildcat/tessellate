var fbAuth            = require('./config.js').passport.facebook,
    FacebookStrategy  = require('passport-facebook').Strategy;
    User              = require('../modules/user/userModel');

module.exports = function(passport) {
  // serialize userId to store during session setup
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  // find user by id when deserializing
  passport.deserializeUser(function (user, done) {
    User.findOne({'facebookId': user.id}, function (err, user) {
      done(err, user);
    });    
  });

  // FACEBOOK PASSPORT STRATEGY
  passport.use(new FacebookStrategy(fbAuth,

    // Passport verification function
    function (accessToken, refreshToken, profile, done) {

      // async verification
      process.nextTick(function(){
        
        User.findOne({'facebookId': profile.id}, function(err, user){
          
          if (err) {
            return done(err);
          }
          // if user is found, log them in
          if (user) {
            return done(null, user);
          } 
          // else create a new user in our DB
          else {
            var newUser = new User();

            newUser.facebookId    = profile.id;
            newUser.name          = profile.displayName;
            newUser.email         = profile.emails[0].value;
            newUser.profPhoto     = profile.photos[0].value;
            newUser.facebookToken = accessToken;

            newUser.save(function(err){
              if (err){
                return done(err);
              }
              return done(null, newUser);
            })
          }
        })
      });
    }));
};
