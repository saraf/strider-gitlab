//used to test the gitlab API wrapper

var expect = require('expect.js')
  , webapp = require('../lib/webapp')
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

describe('gitlab webapp', function() {
  //--------------------------------------------------------------------------------------
  describe('getFile', function() {
    before('Setup the mock gitlab server', function setupNock() {
      nock.cleanAll();
      nock.disableNetConnect();
      require('./mocks/gitlab_webapp_getfile.js')();
    });

    after('Tear down mock Gitlab server', function tearDownNock() {
      nock.cleanAll();
    });


    it('should get a json file correctly', function(done){
      var filename = "strider.json";

      var ref = { 
        branch: 'master',
      };

      //getFile only uses account.config
      var account = {
        config: { 
          api_key: 'zRtVsmeznn7ySatTrnrp',
          api_url: 'http://localhost:80/api/v3' 
        }
      };

      var config = { 
        whitelist: [],
        pull_requests: 'none',
        repo: 'http://nodev/stridertester/privproject1',
        owner: { 
          avatar_url: 'http://www.gravatar.com/avatar/3f671ed86ed3d21ed3640c7a016b0997?s=40&d=identicon',
          state: 'active',
          id: 3,
          username: 'stridertester',
          name: 'Strider Tester' 
        },
        url: 'git@nodev:stridertester/privproject1.git',
        scm: 'git',
        auth: { type: 'ssh' } 
      };

      //getFile only uses project.provider.repo_id
      var project =  {
        provider: { 
          repo_id: '5',
        }
      }

      webapp.getFile(filename, ref, account, config, project, function(err, text) {
        expect(text).to.be.a('string');
        done();
      });
    });
  });

  //--------------------------------------------------------------------------------------
  describe('getBranches', function() {
    //takes parameters - account, config, project
    before('Setup the mock gitlab server', function setupNock() {
      nock.cleanAll();
      nock.disableNetConnect();
      //require('./mocks/gitlab_webapp_getfile.js')();
    });

    after('Tear down mock Gitlab server', function tearDownNock() {
      nock.cleanAll();
    });

    it('should get a correct list of branches in the project');
    it('should complain suitably if account data is empty');
    it('should complain suitably if account data is invalid');
    it('should complain suitable if project.provider.repo_id is empty');
    it('should complain suitable if project.provider.repo_id is invalid');

  });

  //--------------------------------------------------------------------------------------
  describe('listRepos', function() {
    //takes parameters - config, callback
    before('Setup the mock gitlab server', function setupNock() {
      nock.cleanAll();
      nock.disableNetConnect();
      //require('./mocks/gitlab_webapp_getfile.js')();
    });

    after('Tear down mock Gitlab server', function tearDownNock() {
      nock.cleanAll();
    });

    it('should get a list of repositories accessible to the user correctly');
    it('should complain if an invalid config is passed - empty api_key or api_url');
    it('should complain if an invalid config is passed - wrong api_key or api_url');

  });

  //--------------------------------------------------------------------------------------
  describe('setupRepo', function() {
    //takes parameters - account, project, config, callback
    before('Setup the mock gitlab server', function setupNock() {
      nock.cleanAll();
      nock.disableNetConnect();
      //require('./mocks/gitlab_webapp_getfile.js')();
    });

    after('Tear down mock Gitlab server', function tearDownNock() {
      nock.cleanAll();
    });

    it('should callback with an error if account.api_key and account.api_url are not present');
    it('should callback with an error if project.name is not a string');
    it('should callback with an error if project.provider.repo_id is not defined');
    it('should callback with an error if project.branches[0].pubkey is not a valid ssh public key');
    it('should callback with the same config object that we passed in as the second parameter if repo was set up successfully');
  });

  //--------------------------------------------------------------------------------------
  describe('tearDownRepo', function() {
    //takes parameters - account, project, config, callback
    before('Setup the mock gitlab server', function setupNock() {
      nock.cleanAll();
      nock.disableNetConnect();
      //require('./mocks/gitlab_webapp_getfile.js')();
    });

    after('Tear down mock Gitlab server', function tearDownNock() {
      nock.cleanAll();
    });

    it('should callback with an error if account.api_key and account.api_url are not present');
    it('should callback with an error if project.name is not a string');
    it('should callback with an error if project.provider.repo_id is not defined');
    it('should callback with an error if an invalid project name is given - or the project does not exist');
    it('should callback on success with no parameters if the repo was destroyed successfully');

  });

});
