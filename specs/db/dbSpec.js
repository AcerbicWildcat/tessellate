var mongoose = require('mongoose');
var request = require("supertest");
var expect = require('expect.js');
var util = require('util');
//get the environment variables
require('../../node_modules/dotenv').config({silent: true});
var config = require('../../src/server/config/config');
var userSchema = require('../../src/server/db/collections/User');
var eventSchema = require('../../src/server/db/collections/Event');
var mapSchema = require('../../src/server/db/collections/Map');
var imageSchema = require('../../src/server/db/collections/Image');
var mapmaker = require('../../src/server/db/mapmaker');
var getEventAndMap = require('../../src/server/db/getEventAndMap');
var mapHelpers = require('../../src/server/db/getAndReviseMap');
var getEventsByUser = require('../../src/server/db/getEventsByUser');

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

  //TODO: add tests for map and image here.

  it('should create an event, image and map', function (done) {

    var returnObj;
    var setUser;

    new User({
      facebookId: "Mr Oizo"
    }).save(function(err, user){
      mapmaker.mapEventMaker("Mr Oizo", "path", {dummyData: "dummyData"}, {shape: [350, 150]}, "oizoparty", "Oizo Party", function(object){
          returnObj = object;
          setUser = user;
        });
      });

    setTimeout(function(){ 
      //ensure that all relationships are correctly established.
      expect(returnObj.event._creator.toString()).to.equal(setUser._id.toString());
      expect(returnObj.image._id.toString()).to.equal(returnObj.event.mainImage.toString());
      expect(returnObj.image._parentUser.toString()).to.equal(setUser._id.toString());
      expect(returnObj.image._parentEvent.toString()).to.equal(returnObj.event._id.toString());
      expect(returnObj.map._parentImage.toString()).to.equal(returnObj.image._id.toString());
      //ensure that fields are correctly established.
      expect(returnObj.event.name).to.equal("Oizo Party");
      expect(returnObj.event.eventCode).to.equal("oizoparty");
      expect(returnObj.map.height).to.equal(150);
      expect(returnObj.map.data.dummyData).to.equal("dummyData");
      expect(returnObj.image.imgPath).to.equal("path");
      // delete everything.
      //TODO: figure out how to chain removes. They only execute with a callback.
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
    }, 1000);
  });

  it("Should return an event, an event's main image, and that main image's map", function(done){
    new User({
      facebookId: "Mr Oizo"
    })
    .save(function(err, user){
      mapmaker.mapEventMaker("Mr Oizo", "path", {dummyData: "dummyData"}, {shape: [350, 150]}, "oizoparty", "Oizo Party", function(object){
        getEventAndMap(object.event.eventCode, function(object2){
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
        getEventsByUser("Mack Levine", function(response){
          responseObj = response;
        }); //TODO: make sure this has time to run
      });
    });
    
    setTimeout(function(){
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
    }, 1000);
  });

  it("Should revise an existing map in the db and return the REVISED map in the callback", function(done){
    new Map({
      data: {stuff: "A"}
    }).save().then(function(map){
      mapHelpers.reviseMap(map._id, {stuff: "B"}, function(map){
        expect(map.data.stuff).to.equal("B");
        expect(map.data.stuff).to.not.equal("A");
        //make sure the change is reflected in the database as well.
        Map.findOne({_id: map._id}, function(err, map){
          expect(map.data.stuff).to.equal("B");
          Map.remove({
            _id: map._id
          }, function(err){
            done();
          });
        });
      });
    });
  });

});
