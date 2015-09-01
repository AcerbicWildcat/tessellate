var fbAuth            = require('./auth'),
    FacebookStrategy  = require('passport-facebook').Strategy;

module.exports = function(passport) {

  // For now, since we don't have DB of users -->
  // serialize whole user FB profile to support persistent sessions
  passport.serializeUser(function (user, done) {
    done(null, user); // will just be user.id in future once DB up
  });
  // deserialize whole user FB profile
  passport.deserializeUser(function (obj, done) {
    done(null, obj); // will be replaced with finding user.id in our DB later
  });

  // FACEBOOK PASSPORT STRATEGY
  passport.use(new FacebookStrategy(fbAuth,

    // Passport verification function
    function (accessToken, refreshToken, profile, done) {

      // async verification
      process.nextTick(function(){
        
        // This is where we will associate user with a user
        // account in our future DB -->
        // check to see if they exist yet, create new user as
        // long as they don't (for now just returning fb user)
        return done(null, user);
      });
    }));
};
