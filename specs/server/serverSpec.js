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
 * Auth Routes
 * Protected Routes:
 *  - /events
 *  - /events/:eventId/images
 *  - /events/:eventId/map
 */
describe('Protected Routes', function () {

  describe('/events', function () {

    it('should return a 401 status code when any unauthorized request is made', function (done) {
      request(app)
        .get('/events')
        .expect(401)
        .end(function(err, res){
          if (err) return done(err);
          done();
        });
    });

  });

  describe('/events/:eventId/images', function () {

    it('should return a 401 status code when any unauthorized request is made', function (done) {
      request(app)
        .get('/events/testevent/images')
        .expect(401)
        .end(function(err, res){
          if (err) return done(err);
          done();
        });
    });

  });

  describe('/events/:eventId/map', function () {

    it('should return a 401 status code when any unauthorized request is made', function (done) {
      request(app)
        .get('/events/testevent/map')
        .expect(401)
        .end(function(err, res){
          if (err) return done(err);
          done();
        });
    });

  });

});
/**
 * User  paths
 * Paths should be:
 *  - /user GET
 *  - /user POST
 *  - /user/logout GET
 */
describe('user', function () {

  it('GET /user should return a 200 response', function (done) {

    request(app)
      .get('/user')
      .set('facebookid', '1111111111111111')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });

  });

  it('POST /user should return a 201 response', function (done) {

    request(app)
      .post('/user', {name: 'Sample User'})
      .set('facebookid', '1111111111111111')
      .expect(201)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });

  });

  it('GET /user/logout should return a 200 response', function (done) {

    request(app)
      .get('/user/logout')
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
  
  beforeEach(function(){

  });

  afterEach(function(){

  });

  describe('GET /events', function () {
    before
    it('should return a 200', function (done){
      request(app)
        .get('/events')
        .set('facebookid', '1111111111111111')
        .expect(200, done);
    });

    xit('should return a user object containing the users events', function(done){

      request(app)
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
   *  - /event/:eventId/image/ POST
   *  - /event/:eventId/image/ GET
   *  - /event/:eventId/image/:id GET
   *  - /event/:eventId/image/:id DELETE
   */
  describe('event images', function () {

    it('should not return images for invalid image GET route', function () {

      describe('GET /event/:eventId/images', function() {

        it('should return 404 response', function(done){
          request(app)
            .get('/event/25/images')
            .set('facebookid', '1111111111111111')
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