var mongoose = require('mongoose');

var Map = mongoose.Schema({
  _parentImage: {type: mongoose.Schema.Types.ObjectId, ref: "Image"},
  data: {},
  height: Number,
  width: Number
});

module.exports = Map;