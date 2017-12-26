const painless = require('painless');
const createGroup = painless.createGroup;
const localstorageLock = require('./lib');
const runWithLock = localstorageLock.runWithLock;
require('mock-local-storage');


const test = createGroup();

test('basic no contention', (done) => {
  runWithLock('test', () => {
    done();
  });
});

test('2 in a row no contention', (done) => {
  runWithLock('test', () => {
    setTimeout(() => {
      runWithLock('test', () => {
        done();
      }, 0);
    })
  });
});

test('2 at the same time', (done) => {
  runWithLock('test', () => {
    runWithLock('test', () => {
      done();
    });
  });
});

test('3 at the same time', (done) => {
  let done1 = false;
  let done2 = false;

  runWithLock('test', () => {
    let done3 = false
    runWithLock('test', () => {
      done1 = true;

      if (done1 && done2 && done3) {
        done();
      }
    });
    runWithLock('test', () => {
      done2 = true;

      if (done1 && done2 && done3) {
        done();
      }
    });
    done3 = true;
  });
});

