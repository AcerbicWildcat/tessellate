var db = require('./db.js');

var Event = db.Event;

/**
 * Updates an event with the provided update object. Not currently utilized by the app.
 * @param  {String}   eventCode - string used to look up the event by.
 * @param  {Object}   update    - object of keys and values to revise in the found event document.
 * @param  {Function} done      - callback invoked on (err, event) to return the saved, revised event back to the client.
 * @return {Object}             - The revised event.
 */
module.exports = function(eventCode, update, done){
  var conditions = {
    eventCode: eventCode
  };
  var options = {
    new: true
  };
  Event.findOneAndUpdate(conditions, update, options, function (err, revisedEvent){
    if (err){
      done(err);
    } else {
      done(null, revisedEvent);
    }
  });
};