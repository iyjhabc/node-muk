exports.myFoo = function() {
  return 'myFoo';
}

exports.myBar = function() {
  return 'myBar';
}

exports.controllerFun = function() {
  var getName = require('./services').getName;
  return 'hello ' + getName();
}

exports.useSysMethodFun = function() {
  var fs = require('fs');
  return fs();
}