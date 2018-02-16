function getId() {
  return `${Date.now()}:${Math.random()}`
}

export function runWithLock(key, fn, { timeout=1000, lockWriteTime=50, checkTime=10, retry=true} = {}) {
  const timerRunWithLock = () => setTimeout(runWithLock.bind(null, key, fn, { timeout, lockWriteTime, checkTime, retry }), checkTime);
  const result = localStorage.getItem(key);
  if (result) {

    // Check to make sure the lock hasn't expired
    const data = JSON.parse(result);
    if (data.time >= Date.now() - timeout) {
      if (retry) {
        timerRunWithLock();
      }
      return;
    } else {
      localStorage.removeItem(key);
    }
  }
  const id = getId();
  localStorage.setItem(key, JSON.stringify({id, time: Date.now()}));

  // Delay a bit, to see if another worker is in this section
  setTimeout(() => {
    const currentResult = localStorage.getItem(key);
    const data = JSON.parse(currentResult);
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

export function tryRunWithLock(key, fn, { timeout=1000, lockWriteTime=50, checkTime=10}) {
  runWithLock(key, fn, {timeout, lockWriteTime, checkTime, retry: false});
}
