var mongoose = require('mongoose');
var request = require("supertest");
var expect = require('expect.js');
//get the environment variables
require('../../node_modules/dotenv').config({silent: true});
var config = require('../../src/server/config/config');
var userSchema = require('../../src/server/db/collections/User');
var eventSchema = require('../../src/server/db/collections/Event');
var mapSchema = require('../../src/server/db/collections/Map');
var mapmaker = require('../../src/server/db/mapmaker');

var User = mongoose.model("User", userSchema);
var Event = mongoose.model("Event", eventSchema);
var Map = mongoose.model("Map", mapSchema);

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
      expect(returnObj.event._creator.toString()).to.equal(setUser._id.toString());
      expect(returnObj.image._id.toString()).to.equal(returnObj.event.mainImage.toString());
      expect(returnObj.image._parentUser.toString()).to.equal(setUser._id.toString());
      expect(returnObj.image._parentEvent.toString()).to.equal(returnObj.event._id.toString());
      expect(returnObj.map._parentImage.toString()).to.equal(returnObj.image._id.toString());
      expect(returnObj.event.name).to.equal("Oizo Party");
      expect(returnObj.event.eventcode).to.equal("oizoparty");
      done();
    }, 1000);
    //first, create a dummy user.
    // (facebookId, filePath, _storage, pixels, eventCode, eventName, callback)

    //what are some properties we should test for the presence of?
    //delete the dummy user.
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
