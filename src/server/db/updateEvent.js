var db = require('./db.js');

var Event = db.Event;

module.exports = function(eventCode, update, callback){
  var conditions = {
    eventCode: eventCode
  };
  var options = {
    new: true
  };
  Event.findOneAndUpdate(conditions, update, options, function(err, revisedEvent){
    callback(revisedEvent);
  });
};