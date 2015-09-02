//temporarily set node env to test
process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');

var app = require('../../src/server/server.js');

describe('app', function() {
  
  it('should have a config attribute', function () {
    assert(app.config !== undefined);
  });

  describe('config', function () {

    it('should have a port attribute', function () {
      assert(app.config.port !== undefined);
    });

    it('should have a db (database) attribute', function () {
      assert(app.config.db !== undefined);
    });

  });

});

describe('images', function () {

  it('should have an /image GET route', function () {

    describe('GET /image', function() {

      it('should return 200 response', function(done){
        request(app)
          .get('/event/25/images')
          .expect(200, done);
      });

    });

  });

  it('should have an /image POST route', function () {

    describe('POST /user', function() {

      // it('should return 200 response', function(done){
      //   request(app)
      //     .post('/images')
      //     .expect(200, done);
      // });

    });

  });

});

describe('event', function() {

  it('should have an /event POST route', function () {

    describe('POST /event', function () {

      it('should return 200 response', function(done){
        request(app)
          .post('/event')
          .expect(200, done);
      });

      xit('should check to see if the event exists in the DB', function(done){
        request(app)
          .post('/event')
          //code to see if DB has been queried
      });

      xit('should save a new event to the DB with creator', function(done){
        request(app)
          .post('/event', {eventId: 'testEvent'})
          //user we get back from database should not be undefined
      })

    });
  });

});

//set environment back to development
process.env.NODE_ENV = 'development';