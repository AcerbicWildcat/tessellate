// var mongodb = require('mongodb');
var mongoose = require('mongoose');
var request = require("request"); // You might need to npm install the request module!
var expect = require('expect.js');

describe("Tessellate database", function() {
  var dbConnection;

  beforeEach(function(done) {
    mongoose.connect('mongodb://localhost/3000');
  });

  afterEach(function() {
    //wipe all the collections out of the database here.
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
  });

  it("Should analyze an image and save a coordinate map to the database", function(done){
    request({
      
    })
  })
  // it("Should insert posted messages to the DB", function(done) {
  //   // Post the user to the chat server.
  //   request({ method: "POST",
  //             uri: "http://localhost:3000/",
  //             json: { username: "Valjean" }
  //   }, function () {
  //     // Post a message to the node chat server:
  //     request({ method: "POST",
  //             uri: "http://127.0.0.1:3000/classes/messages",
  //             json: {
  //               username: "Valjean",
  //               message: "In mercy's name, three days is all I need.",
  //               roomname: "Hello"
  //             }
  //     }, function () {
  //       // Now if we look in the database, we should find the
  //       // posted message there.

  //       // TODO: You might have to change this test to get all the data from
  //       // your message table, since this is schema-dependent.
  //       var queryString = "SELECT * FROM messages";
  //       var queryArgs = [];

  //       dbConnection.query(queryString, queryArgs, function(err, results) {
  //         // Should have one result:
  //         expect(results.length).to.equal(1);

  //         // TODO: If you don't have a column named text, change this test.
  //         expect(results[0].text).to.equal("In mercy's name, three days is all I need.");

  //         done();
  //       });
  //     });
  //   });
  // });

  // it("Should output all messages from the DB", function(done) {
  //   var queryString = "INSERT INTO Users(username, createdAt, updatedAt) VALUES (?, ?, ?)";
  //   var queryArgs = ["fred", '2014-11-22 08:52:22', '2014-11-22 08:52:22'];
  //   // TODO - The exact query string and query args to use
  //   // here depend on the schema you design, so I'll leave
  //   // them up to you. */

  //   dbConnection.query(queryString, queryArgs, function(err, results) {
  //     // Let's insert a message into the db
  //     var queryString = "INSERT INTO Messages(text, userid, roomname, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)";
  //     var queryArgs = ["Men like you can never change!", results.insertId, "main", '2014-11-22 08:52:22', '2014-11-22 08:52:22'];
  //     // TODO - The exact query string and query args to use
  //     // here depend on the schema you design, so I'll leave
  //     // them up to you. */

  //     dbConnection.query(queryString, queryArgs, function(err) {
  //       if (err) { throw err; }

  //       // Now query the Node chat server and see if it returns
  //       // the message we just inserted:
  //       request("http://127.0.0.1:3000/classes/messages", function(error, response, body) {
  //         var messageLog = JSON.parse(body);
  //         expect(messageLog[0].text).to.equal("Men like you can never change!");
  //         expect(messageLog[0].roomname).to.equal("main");
  //         done();
  //       });
  //     });
  //   });
  // });
});