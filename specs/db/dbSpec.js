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
        getEventsByUser.getEventsByUser("Mack Levine", function(response){
          responseObj = response;
        }); //TODO: make sure this has time to run
      });
    });
    
    setTimeout(function(){
      console.log(util.inspect(responseObj));
      expect(responseObj.events[0].mainImage.imgPath).to.equal("https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg");
      expect(responseObj.events[1].mainImage.imgPath).to.equal("https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg");
      expect(responseObj.events[2].mainImage.imgPath).to.equal("https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg");
      expect(responseObj.events[3].mainImage.imgPath).to.equal("https://secure.static.tumblr.com/54cac0794a6cb43fd4cd1fe946142290/u8ekvhx/fConapwt4/tumblr_static_party-music-hd-wallpaper-1920x1200-38501.jpg");
      done();
    }, 1000);
    
    // done();
      //create several events for this user;
      //when each one saves in turn, create an image in the callback
      //and populate each with a path.
  });

  xit("Should analyze an image and save a coordinate map to the database", function(done){

  });

  xit("Should analyze an image and save a coordinate map to the database", function(done){
    request({ 
      method: "POST",
      uri: "http://localhost:3000/", //need to add whatever route we use...
      json: {
        name: "mack",
        tag: "#mackevent",
        path: "hackreactor.jpg",
        username: "mack"
      }
    }, function() {

        collection.find({height: 250}).toArray(function(err, results){
          expect(results[0].width).to.equal(850); //check height and width...
          done();
        });

    });
  });

});
