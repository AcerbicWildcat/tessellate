var mongoose = require('mongoose');
var request = require("supertest");
var expect = require('expect.js');
var util = require('util');
var getPixels = require('get-pixels');
//get the environment variables
require('../../node_modules/dotenv').config({silent: true});
var config = require('../../src/server/config/config');
var userSchema = require('../../src/server/db/collections/User');
var eventSchema = require('../../src/server/db/collections/Event');
var mapSchema = require('../../src/server/db/collections/Map');
var imageSchema = require('../../src/server/db/collections/Image');

//DB helper services below.

var mapmaker = require('../../src/server/db/mapmaker');
var getEventAndMap = require('../../src/server/db/getEventAndMap');
var mapHelpers = require('../../src/server/db/getAndReviseMap');
var getEventsByUser = require('../../src/server/db/getEventsByUser');
var updateEvent = require('../../src/server/db/updateEvent');
var guestImageMaker = require('../../src/server/db/guestImageMaker');
var joinEvent = require('../../src/server/db/joinEvent');

var User = mongoose.model("User", userSchema);
var Event = mongoose.model("Event", eventSchema);
var Map = mongoose.model("Map", mapSchema);
var Image = mongoose.model("Image", imageSchema);

/**
 * Test script for tessellate database
 */
describe("Tessellate database", function() {

  /**
   * It should create an event
   */
  it('should create a new user and event', function (done) {

    new User({
      name: "smashingpenguin"
    }).save(function(err, user){
      expect(user).to.be.ok();
      new Event({
        _creator: user._id,
        eventCode: "partytime",
        eventName: "Party Time"
      }).save(function(err, event){
        expect(event).to.be.ok();
        done();
      });
    });

  });

  /**
   * It should delete a user
   */
  it('should delete a new user', function (done) {
    User.remove({
      name: "smashingpenguin"
    }).then(function(err) {
      expect(err).to.be.ok();
      done();
    });
  });

  /**
   * It should delete a user
   */
  it('should delete an event', function (done) {
    Event.remove({
      eventCode: "partytime"
    }).then(function(err) {
      expect(err).to.be.ok();
      done();
    });
  });
});

describe('mapmaker.js', function(){
  //TODO: add a before hook here.
  var returnObj;
  var setUser;

  before(function(done){
    new User({
      facebookId: "Mr Oizo"
    }).save(function(err, user){
      mapmaker.mapEventMaker("Mr Oizo", "path", {dummyData: "dummyData"}, {shape: [350, 150]}, "oizoparty", "Oizo Party", function(err, object){
          returnObj = object;
          setUser = user;
          done();
        });
    });
  });

  it('should create an event when invoked', function (done) {
    expect(returnObj.event).to.be.ok;
    done();
  });

  it('should create an image when invoked', function (done) {
    expect(returnObj.image).to.be.ok;
    done();
  });

  it('should create a map when invoked', function (done) {
    expect(returnObj.map).to.be.ok;
    done();
  });

  it('should create an event with a _creator property correctly associated with the parent user', function (done) {
    expect(returnObj.event._creator.toString()).to.equal(setUser._id.toString());
    done();
  });

  it('should create an event with a mainImage property containing the _id of the image that was created', function (done) {
    expect(returnObj.image._id.toString()).to.equal(returnObj.event.mainImage.toString());
    done();
  });

  it('should create an image with a _parentUser property containing the _id of the user who created the event', function (done) {
    expect(returnObj.image._parentUser.toString()).to.equal(setUser._id.toString());
    done();
  });

  it('should create an image with a _parentEvent property containing the _id of the event that was created', function(done){
    expect(returnObj.image._parentEvent.toString()).to.equal(returnObj.event._id.toString());
    done();
  });

  it('should create a map with a _parentEvent property containing the image the map was generated from', function (done) {
    expect(returnObj.map._parentImage.toString()).to.equal(returnObj.image._id.toString());
    done();
  });

  it('should create an event with the correct name', function (done) {
    expect(returnObj.event.name).to.equal("Oizo Party");
    done();
  });

  it('should create an event with the correct event cone', function (done) {
    expect(returnObj.event.eventCode).to.equal("oizoparty");
    done();
  });

  it('should create a map with the correct height property', function (done) {
    expect(returnObj.map.height).to.equal(150);
    done();
  });

  it('should create a map with whatever data value that was passed in', function (done) {
    expect(returnObj.map.data.dummyData).to.equal("dummyData");
    done();
  });

  it('should create an image with a url path', function (done) {
    expect(returnObj.image.imgPath).to.equal("path");
    done();
  });

  after(function(done){
    User.remove({
      facebookId: "Mr Oizo"
    }, function(err){
      Event.remove({
        name: "Oizo Party"
      }, function(err){
        Image.remove({
          imgPath: "path"
        }, function(err){
          Map.remove({
            height: 150
          }, function(err){
            done();
          });
        });    
      });
    });
  });

});

describe('getEventAndMap.js', function(){

  it("Should return an event, an event's main image, and that main image's map", function(done){
    new User({
      facebookId: "Mr Oizo"
    })
    .save(function(err, user){
      mapmaker.mapEventMaker("Mr Oizo", "path", {dummyData: "dummyData"}, {shape: [350, 150]}, "oizoparty", "Oizo Party", function(err, object){
        getEventAndMap(object.event.eventCode, function(err, object2){
          expect(object2.event._creator.toString()).to.equal(user._id.toString());
          expect(object2.image._id.toString()).to.equal(object2.event.mainImage.toString());
          expect(object2.image._parentUser.toString()).to.equal(user._id.toString());
          expect(object2.image._parentEvent.toString()).to.equal(object2.event._id.toString());
          expect(object2.map._parentImage.toString()).to.equal(object2.image._id.toString());
          //ensure that fields are correctly established.
          expect(object2.event.name).to.equal("Oizo Party");
          expect(object2.event.eventCode).to.equal("oizoparty");
          expect(object2.map.height).to.equal(150);
          expect(object2.map.data.dummyData).to.equal("dummyData");
          expect(object2.image.imgPath).to.equal("path");
          User.remove({
            facebookId: "Mr Oizo"
          }, function(err){
            Event.remove({
              name: "Oizo Party"
            }, function(err){
              Image.remove({
                imgPath: "path"
              }, function(err){
                Map.remove({
                  height: 150
                }, function(err){
                  done();
                });
              });    
            });
          });           
        });
      });
    });
  });
});

describe('getEventsByUser.js', function(){

  it("Should return a user populated with events, which in turn are populated with paths for main images", function(done){

    var responseObj;

    new User({
      facebookId: "Mack Levine"
    }).save(function(err, user){
      var event1 = new Event({
        _creator: user._id,
        name: "Borpo's blowout",
        eventCode: "blowout2015"
      });
      return event1.save(function(err, event){
        user.events.push(event);
        var image1 = new Image({
          _parentEvent: event._id,
          imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
        });
        return image1.save(function(err, img){
          event.mainImage = img._id;
          return event.save();
        });
      })
      .then(function(){
        var event2 = new Event({
          eventCode: "dingus22",
          name: "Not a Borpo party"
        });
        return event2.save(function(err, event){
          user.events.push(event);
          var image2 = new Image({
            _parentEvent: event._id,
            imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
          });
          return image2.save(function(err, img){
            event.mainImage = img._id;
            return event.save();
          });
        });
      }).then(function(){
        var event3 = new Event({
          eventCode: "lamegradstudentparty",
          name: "Totally Awesome Rager"
        });
        return event3.save(function(err, event){
          user.events.push(event);
          var image3 = new Image({
            _parentEvent: event._id,
            imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
          });
          return image3.save(function(err, img){
            event.mainImage = img._id;
            return event.save();
          });
        });
      }).then(function(){
        var event4 = new Event({
          _creator: user._id,
          eventCode: "borp2",
          name: "Borpo 2: Electric Borpaloo"
        });
        return event4.save(function(err, event){
          user.events.push(event);
          var image4 = new Image({
            _parentEvent: event._id,
            imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
          });
          return image4.save(function(err, img){
            event.mainImage = img._id;
            return event.save();
          });
        });
      }).then(function(){
        return user.save();
      }).then(function(){
        getEventsByUser("Mack Levine", function(err, response){
          responseObj = response;
          //verifies that image paths show up on the returned object.
          expect(responseObj.events[0].mainImage.imgPath).to.equal("https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg");
          expect(responseObj.events[1].mainImage.imgPath).to.equal("https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg");
          expect(responseObj.events[2].mainImage.imgPath).to.equal("https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg");
          expect(responseObj.events[3].mainImage.imgPath).to.equal("https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg");
          //verifies that the child events have the correct creators.
          expect(responseObj.events[0]._creator.toString()).to.equal(responseObj._id.toString());
          expect(responseObj.events[3]._creator.toString()).to.equal(responseObj._id.toString());

          for (var i = 0; i < responseObj.events.length; i++){
            if (responseObj.events[i]._creator !== undefined){
              responseObj.events[i]._creatorString = responseObj.events[i]._creator.toString();
              //apparently, we cannot overwrite the value of _creator, even when it's a regular
              //object on the server side! It  might be because the object type is ObjectID.
              //For now, we'll put a new property on each event: _creatorString.
              expect(typeof responseObj.events[i]._creatorString).to.equal("string");
            }
          }

          responseObj._idString = responseObj._id.toString();

          expect(typeof responseObj._idString).to.equal("string");
          
          Event.remove({
            _creator: responseObj._id
          }, function(err){
            Event.remove({
              eventCode: "dingus22"
            }, function(err){
              Event.remove({
                eventCode: "lamegradstudentparty"
              }, function(err){
                Image.remove({
                  imgPath: "https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg"
                }, function(err){
                  User.remove({
                    facebookId: "Mack Levine"
                  }, function(err){
                    done();
                  })
                })
              });
            });
          });
        }); //TODO: make sure this has time to run
      });
    });
  });
});

describe('getAndReviseMap', function(){

  it("Should revise an existing map in the db and return the REVISED map in the callback", function(done){
    var event = new Event({
      eventCode: "revisemapevent"
    });
    var image = new Image({
      rgb: "something"
    });
    var map = new Map({
      data: {"stuff": "A"}
    });
    Promise.all([
      event.save(),
      image.save(),
      map.save()
    ]).then(function(data){

      data[0].mainImage = data[1]._id;
      data[1]._parentEvent = data[0]._id;
      data[1].map = data[2]._id;
      data[2].parentImage = data[1]._id;

      return Promise.all([
        data[0].save(), 
        data[1].save(),
        data[2].save()
      ]);

    }).then(function(data){

      var savedEvent = data[2];

      expect(savedEvent.data.stuff).to.equal("A");

      mapHelpers.reviseMap("revisemapevent", {key: "stuff", value: "B"}, function(err, map){
        expect(map.data.stuff).to.equal("B");
        expect(map.data.stuff).to.not.equal("A");
        //make sure the change is reflected in the database as well.
        Map.findOne({_id: map._id}, function(err, foundMap){
          expect(foundMap.data.stuff).to.equal("B");
          Map.remove({
            _id: foundMap._id
          }, function(err){
            Image.remove({
              rgb: "something"
            }, function(err){
              Event.remove({
                eventCode: "revisemapevent"
              }, function(err){
                done();
              });
            });
          });
        });
      });
    });
  });
});

describe('updateEvent.js', function(){

  it("Should be able to revise an event using data in a JSON object", function(done){
    new Event({
      eventCode: "anevent",
      name: "An Event"
    }).save(function(err, event){
      var revision = {
        name: "Another Event",
        eventCode: "anotherevent"
      };
      updateEvent(event.eventCode, revision, function(err, event){
        expect(event.eventCode).to.equal("anotherevent");
        expect(event.name).to.equal("Another Event");
        Event.remove({name: "Another Event"}, function(err){
          done();
        });
      });
    })
  });

});

describe('guestImageMaker.js', function(){

  it("Should generate a valid Cloudinary thumbnail URL", function(done){
    //http://res.cloudinary.com/tesselate/image/upload/v1442015055/khd0vihzt7vdfy63k1ap.png
    var thumbURL = guestImageMaker.thumbnailMaker("v1442015055/khd0vihzt7vdfy63k1ap", "png");
    expect(thumbURL).to.equal("http://res.cloudinary.com/tesselate/image/upload/c_fill,h_100,w_100/v1442015055/khd0vihzt7vdfy63k1ap");
    done();
  });

  it("Should get the average color for an image uploaded to cloudinary", function(done){
    var pixels = getPixels("http://res.cloudinary.com/tesselate/image/upload/c_fill,h_100,w_100/v1442015055/khd0vihzt7vdfy63k1ap", function(err, pixels){
      aveRGB = guestImageMaker.getAverageColor(pixels.data);
      expect(aveRGB.r).to.equal(68);
      expect(aveRGB.g).to.equal(68);
      expect(aveRGB.b).to.equal(59);
      done();
    });
  });

});

describe('joinEvent.js', function(){

  it("Should allow a user to join an event, creating a mutual relationship between the user and the event", function(done){
    new User({
      name: "rando user"
    }).save(function(err, randoUser){
      new Event({
        _creator: randoUser._id,
        eventCode: "dummyevent",
        name: "Dummy Event"
      }).save(function(err, event){
        new User({
          facebookId: "Mack Levine"
        }).save(function(err, user){
          joinEvent("Mack Levine", "dummyevent", function(){
            expect(event.contributors.length).to.be.ok;
            expect(user.events.length).to.be.ok;
            Event.remove({eventCode: "dummyevent"}, function(err){
              User.remove({name: "rando user"}, function(err){
                User.remove({facebookId: "Mack Levine"}, function(err){
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  it("Should not allow a user to join event that they have created", function(done){
    var verdict;
    new User({
      facebookId: "Jimmy Williamson"
    }).save(function(err, user){
      new User({
        facebookId: "Rob Hays"
      }).save(function(err, user2){
        new Event({
          _creator: user2._id,
          eventCode: "robevent"
        }).save(function(err, event){
          event.contributors.push(user);
          event.save(function(err, event){
            joinEvent("Rob Hays", "robevent", function(err, data){
              verdict = data;
              expect(verdict.error).to.equal("Sorry, this is an event you have created");
              expect(event.contributors[0].toString()).to.not.equal(user2._id.toString());
              done();
            });
          });
        });
      });
    });
  });

  it("Should not allow a user to join event that they have already joined", function(done){
    joinEvent("Jimmy Williamson", "robevent", function(err, data){
      verdict = data;
      expect(verdict.error).to.equal("You've already joined this event");
      Event.findOne({
        eventCode: "robevent"
      }, function(err, event){
        expect(event.contributors.length).to.equal(1);
        User.remove({
          facebookId: "Jimmy Williamson"
        }, function(err){
          User.remove({
            facebookId: "Rob Hays"
          }, function(err){
            Event.remove({
              eventCode: "robevent"
            }, function(err){
              done();
            });
          });
        });
      });
    });
  });

});
