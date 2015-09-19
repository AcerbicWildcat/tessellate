var assert = require('assert');
var request = require('supertest');
var nock = require('nock');

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

  xit('should have a /user route', function (done) {

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

  describe('GET /events', function(){

    beforeEach(function(){
      var scope = nock('http://localhost:8000', {
        reqheaders: {
          // 'facebookid': '1111111111111111'
        }
      })
      .get('/events')
      .reply({
        _id: '1234567890123456',
        facebookid: '1111111111111111',
        name: 'Billy Bob',
        events: {
          _creator: '12345',
          eventCode: 'newevent',
          mainImage: 'thisisjustatest.jpg'
        }
      });
    });

    it('should return a 200', function(done){

      request('http://localhost:8000')
        .get('/events')
        .expect(200, done);
    });

    xit('should return a user object containing the users events', function(done){

      request('http://localhost:8000')
        .get('/events')
        .expect(200, done);
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
        assert.ok(err);
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

        xit('should return 404 response', function(done){
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