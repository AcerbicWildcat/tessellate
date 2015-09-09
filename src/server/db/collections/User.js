var mongoose = require('mongoose');

var User = mongoose.Schema({
  facebookId: String,
  name: String,
  email: String,
  profPhoto: String,
  facebookToken: String,
  events: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
  images: [{type: mongoose.Schema.Types.ObjectId, ref: "GuestImage"}]
});

module.exports = User;