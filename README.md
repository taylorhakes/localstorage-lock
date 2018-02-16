# localstorage-lock
Generic localstorage lock implementation

## API
### runWithLock
Run a specified code block with a localstorage lock

**`runWithLock(<localstorage key>, <fn to run>, <options>);`**

Options:
```js
{
  timeout: 1000, // Time release the lock if function fails or takes too long
  lockWriteTime: 50, // Expected time to write to localstorage (unlikely to change)
  checkTime: 10, // How often to recheck the lock, if don't have the lock
  retry: true // Retry getting the lock, if not acquired
}
```

####Example Use
```js

// Make sure only one browser window retrieves a localstorage key and does console.log
runWithLock('lock.some-key', () => {
  
  const someKey = localStorage.getItem('some-key');
  console.log(someKey)
  localStorage.removeItem('some-key')
}, { timeout: 500 });
```

### tryRunWithLock
Wrapper function for `tryWithLock` with option `retry: false`
