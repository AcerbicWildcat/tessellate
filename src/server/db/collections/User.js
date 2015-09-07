var mongoose = require('mongoose');

var User = mongoose.Schema({
  username: String,
  events: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}]
});

module.exports = User;