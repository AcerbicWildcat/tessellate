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

  });

  describe('cloudinary', function () {

    it('should have a cloudinary attribute', function () {
      assert(app.cloudinary !== undefined);
    });

  });

});