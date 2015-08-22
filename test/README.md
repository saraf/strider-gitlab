strider-gitlab tests
====================

The tests use mocha for testing and [nock](https://github.com/pgte/nock) for mocking responses from a gitlab server.

In order to sniff and record the http traffic so that you can create a nock mock out of it, 
use code similar to the following inside the codepath that you want to test:

```
var nock = require('nock');
...

//inside the removeDeployKey function in lib/api.js
var appendLogToFile = function(content) {
  fs.appendFile('/noderoot/gitlab_remove_deploykey.txt', content);
};

nock.recorder.rec({
  logging: appendLogToFile,
});
```
Then, with an actual Gitlab server running and configured,
running the codepath - either using the GUI, or from within the test,
will cause the http transactions to be dumped to the specified file.

Use the contents of that file to add to/modify the mocks present in the
mocks/ subdirectory.

Use util.inspect to log the parameters passed to the function to be tested when the 
codepath is run, in order to understand what needs to be passed to the function in
the test file.
