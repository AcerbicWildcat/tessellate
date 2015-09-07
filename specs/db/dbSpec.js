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

  it('should create a new user', function (done) {

    new User({
      username: "mack"
    }).save(function(err, mack) {
      expect(mack).to.be.ok();
      done();
    });

  });

  it('should delete a new user', function (done) {

    User.remove({
      username: "mack"
    }).then(function(err) {
      expect(err).to.be.ok();
      done();
    });

  });

  xit("Should analyze an image and save a coordinate map to the database", function(done){

  });

  xit("Should analyze an image and save a coordinate map to the database", function(done){
    request({ method: "POST",
              uri: "http://localhost:3000/", //need to add whatever route we use...
              json: {
                name: "mack",
                tag: "#mackevent",
                path: "hackreactor.jpg",
                username: "mack"
              }
    }, function(){
      mongoose.connection.db.collection("maps", function(err, collection){

        collection.find({height: 250}).toArray(function(err, results){
          expect(results[0].width).to.equal(850); //check height and width...
          done();
        });
        //now do something to verify that the map showed up in there.
      });
    });
  });



});
