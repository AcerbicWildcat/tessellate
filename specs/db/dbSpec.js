var mongoose = require('mongoose');
var request = require("supertest");
var expect = require('expect.js');
//get the environment variables
require('../../node_modules/dotenv').config({silent: true});
var config = require('../../src/server/config/config');
var userSchema = require('../../src/server/db/collections/User');
var eventSchema = require('../../src/server/db/collections/Event');
var mapSchema = require('../../src/server/db/collections/Map');

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
      username: "smashingpenguin"
    }).save(function(err, user){
      expect(user).to.be.ok();
      new Event({
        _parentUser: user._id,
        username: user.username,
        eventCode: "partytime",
        path: "http://res.cloudinary.com/tesselate/image/upload/v1441481287/dgqwfqdeckpdyoantea6.jpg",
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
      username: "smashingpenguin"
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
      username: "smashingpenguin"
    }).then(function(err) {
      expect(err).to.be.ok();
      done();
    });
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
