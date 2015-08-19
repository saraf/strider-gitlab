//used to test the gitlab API wrapper
var expect = require('expect.js')
  , api = require('../lib/api')
  , util = require('util')
  , nock = require('nock');

//nock will simulate a gitlab server running at
//localhost:80, where Strider Tester, a user is
//registered with the name "stridertester", and
//has been registered with api token - zRtVsmeznn7ySatTrnrp 
//stridertester is an "owner" of a group named "testunion"
//and has admin access to three projects - 
// testunion / unionproject1
// Strider Tester / pubproject1
// Strider Tester / privproject1

describe('gitlab api', function() {
  describe('get', function() {
    before('Setup the mock gitlab server', function setupNock() {
      nock.cleanAll();
      nock.disableNetConnect();
      require('./mocks/gitlab_get.js')();
    });

    after('Tear down mock Gitlab server', function tearDownNock() {
      nock.cleanAll();      
    });

    it('should get a list of projects', function(done){
      var config = {
        api_key: 'zRtVsmeznn7ySatTrnrp', 
        api_url: 'http://localhost:80/api/v3' 
      };

      api.get(config, 'projects', function(err, body, res) {
        expect(err).to.not.be.ok();
        expect(body).to.be.an(Array);
        done();
      });
    }) 

    it('should return an error if a non existent path is asked for', function(done){
      var config = {
        api_key: 'zRtVsmeznn7ySatTrnrp', 
        api_url: 'http://localhost:80/api/v3' 
      };

      var wrongPath = 'nonexistentpath';

      api.get(config, wrongPath, function(err, body, res) {
        expect(err).to.be.ok();
        expect(err).to.be.an(Error);
        expect(err.status).to.eql('404');
        done();
      });
    })

    it('should return a 401 error if incorrect credentials are specified', function(done) {
      var wrongKeyConfig = {
        api_key: 'zRtVsmeznn7ySatTrnra', 
        api_url: 'http://localhost:80/api/v3' 
      };

      api.get(wrongKeyConfig, 'projects', function(err, body, res) {
        expect(err).to.be.ok();
        expect(err).to.be.an(Error);
        expect(err.status).to.eql('401');
        done();
      });
    })

    it('should return an error if the specified gitlab server IP cannot be resolved from the name', function(done) {
      var invalidServerNameConfig = {
        api_key: 'zRtVsmeznn7ySatTrnrp', 
        api_url: 'http://localghost:80/api/v3' 
      };
      api.get(invalidServerNameConfig, 'projects', function(err, body, res) {
        expect(err).to.be.ok();
        expect(err).to.be.an(Error);
        done();
      });
    })

    it('should return an error if the config passed in to it does not have a Gitlab API url', function(done) {
      var config = { api_key: 'zRtVsmeznn7ySatTrnrp' };
      api.get(config, 'projects', function(err, body, res) {
        expect(err).to.be.ok();
        expect(err).to.be.an(Error);
        done();
      });
    })

    it('should invoke our callback with the first parameter as undefined if the Gitlab server responds with a falsy value for res.body');
  })
});
