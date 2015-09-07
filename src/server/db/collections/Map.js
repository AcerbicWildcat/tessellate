var mongoose = require('mongoose');

var Map = mongoose.Schema({
  _parentEvent: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
  data: {},
  height: Number,
  width: Number
});

module.exports = Map;