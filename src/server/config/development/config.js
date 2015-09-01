var Firebase = require('firebase');
var db = new Firebase("https://tessellate.firebaseio.com/");

module.exports = exports = {
  port : 8000,
  db : db
};