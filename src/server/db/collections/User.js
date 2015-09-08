var mongoose = require('mongoose');

var User = mongoose.Schema({
  username: String,
  facebookId: String,
  name: String,
  email: String,
  profPhoto: String,
  facebookToken: String,
  events: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
  joinedEvents: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
  guestImages: [{type: mongoose.Schema.Types.ObjectId, ref: "GuestImage"}]
});

module.exports = User;