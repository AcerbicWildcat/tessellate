var assert = require('assert');
var request = require('supertest');

var app = require('../../src/server/server.js');

/**
 * app tests
 */
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

/**
 * User  paths
 * Paths should be:
 *  - /user GET
 *  - /user/logout
 */
describe('user', function () {

  it('should have a /user route', function (done) {

    request(app)
      .head('/user')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });

  });

  it('should have a /user/logout route', function (done) {

    request(app)
      .head('/user/logout')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });

  });

});


/**
 * Event  paths
 * Paths should be:
 *  - /event/ POST
 *  - /event/:id GET
 *  - /event/:id DELETE
 */
describe('event', function() {

  xit('GET /event should return a 200', function(done){
    request(app)
      .get('/event')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });

  xit('POST /event should return a 200', function(done){
    request(app)
      .post('/event', {'eventCode': 'xaxaxaxax' })
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });
  
  it('should return an error object if event does not exist', function(done){

    request(app)
      .get('/event/xyz')
      .expect(200)
      .end(function(err, res) {
        assert.ok(err === null);
        done();
      });

  });

  xit('should update an event object', function(done){

    request(app)
      .put('/event/xyz')
      .expect(200)
      .end(function(err, res) {
        assert.ok(err === null);
        done();
      });

  });

  xit('should return an event object', function(done){

  });

  /**
   * Event image paths
   * Paths should be:
   *  - /event/eventId/images/ POST
   *  - /event/eventId/images/ GET
   *  - /event/eventId/images/:id GET
   *  - /event/eventId/images/:id DELETE
   */
  describe('event images', function () {

    it('should not return images for invalid image GET route', function () {

      describe('GET /event/:eventId/images', function() {

        it('should return 404 response', function(done){
          request(app)
            .get('/event/25/images')
            .expect(404, done);
        });

      });

    });

    xit('should return a JSON object of a specifig image in an event', function () {

      describe('GET /event/:eventId/image/:imageId', function() {

        it('should return 404 response', function(done){
          request(app)
            .get('/event/25/images/88')
            .expect(404, done);
        });

      });

    });

    xit('should return a JSON object of all images for an event', function () {

      describe('GET /event/:eventId/image', function() {

        it('should return 404 response', function(done){
          request(app)
            .get('/event/25/images')
            .expect(404, done);
        });

      });

    });

  });

});