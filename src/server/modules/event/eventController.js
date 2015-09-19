var sendResp = require('../../config/helpers').sendResponse,
    db       = require('../../db/db'),
    mapmaker = require('../../db/mapmaker'),
    getEventAndMap = require('../../db/getEventAndMap'),
    updateEvent = require('../../db/updateEvent'),
    cloudinary = require('cloudinary'),
    getEventsByUser = require('../../db/getEventsByUser.js'),
    joinEvent = require('../../db/joinEvent');
   
module.exports = {
  /**
   * @namespace getEvents
   * @desc Returns JSON user object populated with events.         
   */
  getEvents: function (req, res, next) {
    var facebookId;
    if (!!req.headers.facebookid){
      facebookId = req.headers.facebookid;
    } else {
      facebookId = req.user.facebookId;
    }
    getEventsByUser(facebookId, function (err, user){
      if (err){
        next(err);
      }
      if (!user){
        sendResp(res, {error: 'Error: User Does Not Exist'}, 404);
      } else {
        if (user.events){ 
          for (var i = 0; i < user.events.length; i++){
            user.events[i]._creatorString = user.events[i]._creator.toString();
          }
        }
        user._idString = user._id.toString();
        res.json(user);
      }
    });
  },

  /**
   * @namespace getEvent
   * @desc Returns JSON object of a particular event.
   */
  getEvent: function (req, res, next){
    var eventCode = req.params.eventId;
    getEventAndMap(eventCode, function (err, event){
      if (err){
        next(err);
      } else {
        sendResp(res, event, 200);
      }
    });
  },

  /**
   * @namespace updateEvent
   * @desc Updates event in database and returns updated JSON event object.
   */
  updateEvent: function (req, res, next){
    updateEvent(req.body.eventCode, req.body.update, function (err, event){
      if (err){
        next(err);
      } else {
        sendResp(res, event, 200);
      }
    });
  },

  /**
   * @namespace createEvent
   * @desc Creates new event and returns JSON event object.
   */
  createEvent: function (req, res, next){

    var eventCode = req.body.eventCode,
        eventName = req.body.eventName,
        path = req.file.path;
    var facebookId;
    if (!!req.headers.facebookid){
      facebookId = req.headers.facebookid;
    } else {
      facebookId = req.user.facebookId;
    }

    db.Event.findOne({eventCode: eventCode}, function (err, event){
      if (err){
        next(err);
      }
      if (event){
        sendResp(res, {error: "Event Code Already Taken"}, 409);
      } else {
        cloudinary.uploader.upload(path, function (result) {
          var uniformlySizedImageUrl = cloudinary.url(result.public_id, {
              width: 500,
              height: 500,
              crop: 'fill'
            }); 
          mapmaker.saveEventAndMap(facebookId, uniformlySizedImageUrl, eventCode, eventName, function (err, createdEvent){
            if (err){
              next(err);
            } else {
              sendResp(res, createdEvent, 201);
            }
          });
        });
      }
    });
  },

  /**
   * @namespace joinEvent
   * @desc Adds user to list of event contributors and returns updated JSON event object.
   */
  joinEvent: function (req, res){
    var eventCode = req.params.eventId;
    var facebookId;
    if (!!req.headers.facebookid){
      facebookId = req.headers.facebookid;
    } else {
      facebookId = req.user.facebookId;
    }
    joinEvent(facebookId, eventCode, function (err, eventOrErrorMessage){
      if (err){
        console.dir(err);
      } else {
        if (eventOrErrorMessage.error){
          if(eventOrErrorMessage.error === "event does not exist"){
            sendResp(res, eventOrErrorMessage, 404);
          } else {
            sendResp(res, eventOrErrorMessage, 422);
          }
        } else {
          sendResp(res, eventOrErrorMessage, 200);
        }
      }
    });

  }  

};