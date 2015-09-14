var fbAuth            = require('./config.js').passport.facebook,
    FacebookStrategy  = require('passport-facebook').Strategy;
    User              = require('../db/db').User;

module.exports = function(passport) {   

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
                console.log('USER DB SAVE ERROR: ', err);
              }
              return done(null, newUser);
            })
          }
        })
      });
    }));
  // serialize userId to store during session setup
  passport.serializeUser(function (user, done) {
    console.log("USER IN SERIALIZE: ", user);
    done(null, user);
  });
  // find user by id when deserializing
  passport.deserializeUser(function (user, done) {
    console.log("USER IN DESERIALIZE: ", user);
    User.findOne({facebookId: user.facebookId}, function (err, user) {
      done(null, user);
    });
  }); 
};
