(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.localstoragelock = {})));
}(this, (function (exports) { 'use strict';

function getId() {
  return Date.now() + ":" + Math.random();
}

function runWithLock(key, fn) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === undefined ? 1000 : _ref$timeout,
      _ref$lockWriteTime = _ref.lockWriteTime,
      lockWriteTime = _ref$lockWriteTime === undefined ? 50 : _ref$lockWriteTime,
      _ref$checkTime = _ref.checkTime,
      checkTime = _ref$checkTime === undefined ? 10 : _ref$checkTime,
      _ref$retry = _ref.retry,
      retry = _ref$retry === undefined ? true : _ref$retry;

  var timerRunWithLock = function timerRunWithLock() {
    return setTimeout(runWithLock.bind(null, key, fn, { timeout: timeout, lockWriteTime: lockWriteTime, checkTime: checkTime, retry: retry }), checkTime);
  };
  var result = localStorage.getItem(key);
  if (result) {

    // Check to make sure the lock hasn't expired
    var data = JSON.parse(result);
    if (data.time >= Date.now() - timeout) {
      if (retry) {
        timerRunWithLock();
      }
      return;
    } else {
      localStorage.removeItem(key);
    }
  }
  var id = getId();
  localStorage.setItem(key, JSON.stringify({ id: id, time: Date.now() }));

  // Delay a bit, to see if another worker is in this section
  setTimeout(function () {
    var currentResult = localStorage.getItem(key);
    var data = JSON.parse(currentResult);
    if (data.id !== id) {
      if (retry) {
        timerRunWithLock();
      }
      return;
    }

    try {
      fn();
    } finally {
      localStorage.removeItem(key);
    }
  }, lockWriteTime);
}

function tryRunWithLock(key, fn, _ref2) {
  var _ref2$timeout = _ref2.timeout,
      timeout = _ref2$timeout === undefined ? 1000 : _ref2$timeout,
      _ref2$lockWriteTime = _ref2.lockWriteTime,
      lockWriteTime = _ref2$lockWriteTime === undefined ? 50 : _ref2$lockWriteTime,
      _ref2$checkTime = _ref2.checkTime,
      checkTime = _ref2$checkTime === undefined ? 10 : _ref2$checkTime;

  runWithLock(key, fn, { timeout: timeout, lockWriteTime: lockWriteTime, checkTime: checkTime, retry: false });
}

exports.runWithLock = runWithLock;
exports.tryRunWithLock = tryRunWithLock;

Object.defineProperty(exports, '__esModule', { value: true });

})));
