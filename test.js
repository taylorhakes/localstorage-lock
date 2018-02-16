const painless = require('painless');
const createGroup = painless.createGroup;
const localstorageLock = require('./lib');
const runWithLock = localstorageLock.runWithLock;
require('mock-local-storage');
const assert = painless.assert;


const test = createGroup();

test('basic no contention', (done) => {
  runWithLock('test',  done);
});

test('2 in a row no contention', (done) => {
  runWithLock('test', () => {
    setTimeout(() => {
      runWithLock('test', done);
    }, 0)
  });
});

test('2 at the same time', (done) => {
  let ran = false;
  runWithLock('test', () => {
    ran = true;
    runWithLock('test', () => {
      assert(ran);
      done();
    });
  });
});

test('3 at the same time', (done) => {
  let done2 = null;
  let done3 = null;

  runWithLock('test', () => {
    let done1 = Date.now();
    runWithLock('test', () => {
      done2 = Date.now();

      if (done1 && done2 && done3) {
        assert.isBelow(done1, done2);
        assert.isBelow(done1, done3)
        done();
      }
    });
    runWithLock('test', () => {
      done3 = Date.now();

      if (done1 && done2 && done3) {
        assert.isBelow(done1, done2);
        assert.isBelow(done1, done3);
        done();
      }
    });
  });
});

