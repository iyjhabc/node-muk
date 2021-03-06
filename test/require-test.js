var muk = require('..');
var assert = require('assert');


function testMockDependency(dir, filename) {
  var deps = {};
  var mock = deps[filename] = { existsSync: function() { return true; } };
  var original;

  it('Original loads without mock', function(done) {
    require(dir)(filename, function(err, result) {
      original = result;
      done();
    });
  });

  it('Correctly mocks dependency', function(done) {
    muk(dir, deps)(filename, function(err, result) {
      assert.equal(result, mock, 'returned module is mocked object');
      done();
    });
  });

  it('Correctly requires non-mocked dependency', function(done) {
    muk(dir, deps)('assert', function(err, result) {
      assert.equal(assert, result,
                   'returned module is the same one used in these tests');
      done();
    });
  });

  it('Original module is restored when require() is called', function(done) {
    delete require.cache[require.resolve(dir)];

    require(dir)(filename, function(err, result) {
      assert.equal(result, original,
                   'requiring module again returns orignal module');
      done();
    });
  });
}


describe('Mock required user land dependency', function() {
  testMockDependency('./custom', 'mocha');
});

describe('Mock require native module', function() {
  testMockDependency('./custom', 'fs');
});

describe('Mock required relative file', function() {
  testMockDependency('./custom', './foo');
});

describe('Mock required relative file in a different dir', function() {
  require('./dir')('./custom', './bar');
});
