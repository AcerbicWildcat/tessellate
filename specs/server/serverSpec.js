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
          .get('/images')
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

//set environment back to development
process.env.NODE_ENV = 'development';