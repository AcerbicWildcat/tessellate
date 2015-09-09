module.exports = {
  port : process.env.PORT || 8000,
  cloudinary : {
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME, 
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
  },
  passport: {
    facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id','emails', 'first_name', 'last_name', 'displayName', 'photos']
    }
  },
  db: {
    host: process.env.DB_HOST
  },
  sessionSecret: process.env.SESSION_SECRET
};