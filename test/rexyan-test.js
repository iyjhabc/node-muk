'use strict';

var muk    = require('..');
var assert = require('assert');
var methods = require('./testData/methods');
var services = require('./testData/services');


describe('Mock methods', function() {

  afterEach(muk.restore);

  it('mock functions in module', function() {
    var myFooMock = function() {
      return 'myFooMock';
    };
    var myBarMock = function() {
      return 'myBarMock';
    };
    muk(methods, 'myFoo', myFooMock);
    muk(methods, 'myBar', myBarMock);
    assert.equal(methods.myFoo(), 'myFooMock');
    assert.equal(methods.myBar(), 'myBarMock');
  });

  it('mock controller functions', function() {
    var getNameMock = function() {
      return 'getNameMock';
    };
    muk(services, 'getName', getNameMock);
    assert.equal(methods.controllerFun(), 'hello getNameMock');
  });

  it('mock controller functions which use relative path module', function() {
    var getNameMock = function() {
      return 'getNameMock';
    };
    var methodsMock = muk('./testData/methods', { // 测试methods，把methods文件中的相对路径所代表的对象(./services)mock掉
      './services': {
        getName: getNameMock,
      },
    });
    assert.equal(methodsMock.controllerFun(), 'hello getNameMock');
  });

  it('mock function which use non-relative path module', function() {
    var fsMock = function() {
      return 'fsMock';
    };
    var methodsMock = muk('./testData/methods', { // 测试methods，把methods文件中使用名称require进来的对象(fs)mock掉
      'fs': fsMock,
    });
    assert.equal(methodsMock.useSysMethodFun(), 'fsMock');
  });

  it('mock properties', function() {
    var config = {
      timeout: 10,
      show: false,
    };
    muk(config, 'timeout', 20);
    assert.equal(config.timeout, 20, 'object perperty is mocked');
    muk.restore();
    assert.equal(config.timeout, 10, 'object perperty is restore after mocked');
  });

});
