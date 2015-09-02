var sendResp = require('../../config/helpers').sendResponse;

module.exports = {

  handleCode: function (req, res){
    // if new, create new event, save to DB
    // take user to event/:eventId
    sendResp(res);
  }

}