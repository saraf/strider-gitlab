//used to test the gitlab API wrapper
var expect = require('expect.js')
  , api = require('../lib/api')
  , util = require('util')
  , nock = require('nock');

var correctConfig = {
  api_key: 'zRtVsmeznn7ySatTrnrp', 
  api_url: 'http://localhost:80/api/v3' 
};

var wrongKeyConfig = {
  api_key: 'zRtVsmeznn7ySatTrnra', 
  api_url: 'http://localhost:80/api/v3' 
};


var correctDeployKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDAMoSHhKfeE3/oXanAQEZO0Sq20SMjvjmJlTy+CaGz/1uk+glLXi9u2RKtfPRZDceAgyEtRUpqya9Uo1v9bjkIckGLhQwXdSo2G6O3QuzpE3gc6AXTDPQ0ZkkXbSdU9VGL1Zzr+maBnvfwK6IlsNz3fLa4lNV7vz1LaGCg9D1jP+nufZjuDiCAno7D607oG1iHQ3x/BqzphUATav3DFQFT2FBmmittQT0l0mMJ4XsQCQXkwNbDjkLYNon8FYPm9U3AOlzicOGteebt5mhsQtfl9+lL99B8+fk8b24pEEbOxZ4l0HcwMI1R5OLoTzPwSvVw+bp3YPhH2IzfFwK5NUk7 stridertester/privproject1-stridertester@gmail.com\n";

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
  before('Setup the mock gitlab server', function setupNock() {
      nock.cleanAll();
      nock.disableNetConnect();
      require('./mocks/gitlab_get.js')();
      require('./mocks/gitlab_add_remove_keys.js')();
  });

  after('Tear down mock Gitlab server', function tearDownNock() {
    nock.cleanAll();      
  });

  //--------------------------------------------------------------------------------------
  describe('get', function() {
    it('should get a list of projects', function(done){
      var config = {
        api_key: 'zRtVsmeznn7ySatTrnrp', 
        api_url: 'http://localhost:80/api/v3' 
      };

      api.get(correctConfig, 'projects', function(err, body, res) {
        expect(err).to.not.be.ok();
        expect(body).to.be.an(Array);
        done();
      });
    }) 

    it('should return an error if a non existent path is asked for', function(done){

      var wrongPath = 'nonexistentpath';

      api.get(correctConfig, wrongPath, function(err, body, res) {
        expect(err).to.be.ok();
        expect(err).to.be.an(Error);
        expect(err.status).to.eql('404');
        done();
      });
    })

    it('should return a 401 error if incorrect credentials are specified', function(done) {
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
  });

  //--------------------------------------------------------------------------------------
  describe('parseRepo', function(){
    it('should correctly parse repo information as received from gitlab server into a repo object');
    it('should throw an error if it gets an empty parameter as repo ?'); 
    it('should throw an error if repo.id is absent ?'); 
    it('should throw an error if repo.path_with_namespace is absent ?'); 
    it('should throw an error if repo.web_url is absent ?'); 
    it('should throw an error if repo.public is absent ?'); 
    it('should throw an error if repo.ssh_url_to_repo is absent ?'); 
    it('should throw an error if repo.owner is absent ?'); 
    it('should throw an error if repo.web_url is absent ?'); 

    /*
       return {
 83     id: repo.id,
 84     name: repo.path_with_namespace,
 85     display_name: repo.path_with_namespace,
 86     display_url: repo.web_url,
 87     group: repo.namespace.path,
 88     private: !repo.public,
 89     config: {
 90       auth: {type: 'ssh'},
 91       scm: 'git',
 92       url: repo.ssh_url_to_repo,
 93       owner: repo.owner,
 94       repo: repo.web_url,
 95       pull_requests: 'none',
 96       whitelist: []
 97     }
*/
  });

  //--------------------------------------------------------------------------------------
  describe('addDeployKey', function() {
    it('should return an error if any of its expected arguments are absent');

    it('should invoke our callback with err as null and the second parameter as true, when given correct parameters', function(done) {
      api.addDeployKey(correctConfig, 5, 'strider-stridertester/privproject1', correctDeployKey, function(err, secondParam) {
        expect(err).to.not.be.ok();
        expect(secondParam).to.be.ok(); 
        done();
      });
    });

    it('should give an error if invalid data is sent as a key', function(done) {
       api.addDeployKey(correctConfig, 5, 'strider-stridertester/privproject1', "invalid-key", function(err, secondParam) {
        //console.log("Err is: " + util.inspect(err, false, 10, true)); 
        expect(err).to.be.ok();
        done();
      });
    });

    it('should give an error if incorrect credentials are passed to it', function(done) {
       api.addDeployKey(wrongKeyConfig, 5, 'strider-stridertester/privproject1', correctDeployKey, function(err, secondParam) {
        //console.log("Err is: " + util.inspect(err, false, 10, true)); 
        expect(err).to.be.ok();
        done();
      });
    });

    it('should return an error if the specified gitlab server IP cannot be resolved from the name', function(done) {
      var invalidServerNameConfig = {
        api_key: 'zRtVsmeznn7ySatTrnrp', 
        api_url: 'http://localghost:80/api/v3' 
      };
      api.addDeployKey(invalidServerNameConfig, 5, 'strider-stridertester/privproject1', correctDeployKey, function(err, secondParam) {
        expect(err).to.be.ok();
        expect(err).to.be.an(Error);
        done();
      });
    });

    it('should return an error if the config passed in to it does not have a Gitlab API url', function(done) {
      var config = { api_key: 'zRtVsmeznn7ySatTrnrp' };
      api.addDeployKey(config, 5, 'strider-stridertester/privproject1', correctDeployKey, function(err, secondParam) {
        expect(err).to.be.ok();
        expect(err).to.be.an(Error);
        done();
      });
    })
    
    it('should give an error if invalid repo id is passed to it', function(done) {
      api.addDeployKey(correctConfig, "wrong repo id", 'strider-stridertester/privproject1', correctDeployKey, function(err, secondParam) {
        //console.log("Err is: " + util.inspect(err, false, 10, true)); 
        expect(err).to.be.ok();
        done();
      });
    });
  });

  //--------------------------------------------------------------------------------------
  describe('removeDeployKey', function() {

  });

  //--------------------------------------------------------------------------------------
  describe('createHooks', function() {

  });
  
  //--------------------------------------------------------------------------------------
  describe('deleteHooks', function() {

  });
});
