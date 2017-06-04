'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Champion = mongoose.model('Champion'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  champion;

/**
 * Champion routes tests
 */
describe('Champion CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Champion
    user.save(function () {
      champion = {
        name: 'Champion name'
      };

      done();
    });
  });

  it('should be able to save a Champion if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Champion
        agent.post('/api/champions')
          .send(champion)
          .expect(200)
          .end(function (championSaveErr, championSaveRes) {
            // Handle Champion save error
            if (championSaveErr) {
              return done(championSaveErr);
            }

            // Get a list of Champions
            agent.get('/api/champions')
              .end(function (championsGetErr, championsGetRes) {
                // Handle Champions save error
                if (championsGetErr) {
                  return done(championsGetErr);
                }

                // Get Champions list
                var champions = championsGetRes.body;

                // Set assertions
                (champions[0].user._id).should.equal(userId);
                (champions[0].name).should.match('Champion name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Champion if not logged in', function (done) {
    agent.post('/api/champions')
      .send(champion)
      .expect(403)
      .end(function (championSaveErr, championSaveRes) {
        // Call the assertion callback
        done(championSaveErr);
      });
  });

  it('should not be able to save an Champion if no name is provided', function (done) {
    // Invalidate name field
    champion.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Champion
        agent.post('/api/champions')
          .send(champion)
          .expect(400)
          .end(function (championSaveErr, championSaveRes) {
            // Set message assertion
            (championSaveRes.body.message).should.match('Please fill Champion name');

            // Handle Champion save error
            done(championSaveErr);
          });
      });
  });

  it('should be able to update an Champion if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Champion
        agent.post('/api/champions')
          .send(champion)
          .expect(200)
          .end(function (championSaveErr, championSaveRes) {
            // Handle Champion save error
            if (championSaveErr) {
              return done(championSaveErr);
            }

            // Update Champion name
            champion.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Champion
            agent.put('/api/champions/' + championSaveRes.body._id)
              .send(champion)
              .expect(200)
              .end(function (championUpdateErr, championUpdateRes) {
                // Handle Champion update error
                if (championUpdateErr) {
                  return done(championUpdateErr);
                }

                // Set assertions
                (championUpdateRes.body._id).should.equal(championSaveRes.body._id);
                (championUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Champions if not signed in', function (done) {
    // Create new Champion model instance
    var championObj = new Champion(champion);

    // Save the champion
    championObj.save(function () {
      // Request Champions
      request(app).get('/api/champions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Champion if not signed in', function (done) {
    // Create new Champion model instance
    var championObj = new Champion(champion);

    // Save the Champion
    championObj.save(function () {
      request(app).get('/api/champions/' + championObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', champion.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Champion with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/champions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Champion is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Champion which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Champion
    request(app).get('/api/champions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Champion with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Champion if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Champion
        agent.post('/api/champions')
          .send(champion)
          .expect(200)
          .end(function (championSaveErr, championSaveRes) {
            // Handle Champion save error
            if (championSaveErr) {
              return done(championSaveErr);
            }

            // Delete an existing Champion
            agent.delete('/api/champions/' + championSaveRes.body._id)
              .send(champion)
              .expect(200)
              .end(function (championDeleteErr, championDeleteRes) {
                // Handle champion error error
                if (championDeleteErr) {
                  return done(championDeleteErr);
                }

                // Set assertions
                (championDeleteRes.body._id).should.equal(championSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Champion if not signed in', function (done) {
    // Set Champion user
    champion.user = user;

    // Create new Champion model instance
    var championObj = new Champion(champion);

    // Save the Champion
    championObj.save(function () {
      // Try deleting Champion
      request(app).delete('/api/champions/' + championObj._id)
        .expect(403)
        .end(function (championDeleteErr, championDeleteRes) {
          // Set message assertion
          (championDeleteRes.body.message).should.match('User is not authorized');

          // Handle Champion error error
          done(championDeleteErr);
        });

    });
  });

  it('should be able to get a single Champion that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Champion
          agent.post('/api/champions')
            .send(champion)
            .expect(200)
            .end(function (championSaveErr, championSaveRes) {
              // Handle Champion save error
              if (championSaveErr) {
                return done(championSaveErr);
              }

              // Set assertions on new Champion
              (championSaveRes.body.name).should.equal(champion.name);
              should.exist(championSaveRes.body.user);
              should.equal(championSaveRes.body.user._id, orphanId);

              // force the Champion to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Champion
                    agent.get('/api/champions/' + championSaveRes.body._id)
                      .expect(200)
                      .end(function (championInfoErr, championInfoRes) {
                        // Handle Champion error
                        if (championInfoErr) {
                          return done(championInfoErr);
                        }

                        // Set assertions
                        (championInfoRes.body._id).should.equal(championSaveRes.body._id);
                        (championInfoRes.body.name).should.equal(champion.name);
                        should.equal(championInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Champion.remove().exec(done);
    });
  });
});
