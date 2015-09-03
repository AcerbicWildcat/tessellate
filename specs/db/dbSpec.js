//mongo must be running and the server must be running for these
//tests to pass. How do I guarantee this?


var mongoose = require('mongoose');
var request = require("request"); // Might want to swap out with supertest
var expect = require('expect.js');
// var db = require('./db.js')

describe("Tessellate database", function() {

  beforeEach(function(done) {

    mongoose.connect('mongodb://localhost/3000');

    mongoose.connection.once('open', function(){
      done(); //guarantees that the connection is open before tests proceed.
    });

  });

  afterEach(function(done) {
    //wipe all the collections out of the database here.
    mongoose.connection.db.dropDatabase(function(err){
      mongoose.connection.close(function(){
        done();
      });
    });
  });

  xit("Should analyze an image and save a coordinate map to the database", function(done){
    request({
      
    })
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
