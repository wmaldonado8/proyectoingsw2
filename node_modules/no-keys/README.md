# no-keys v0.1.0

```js
const noKeys = require('no-keys')

noKeys({ }) // => true

noKeys({ a: 1 }) // => false

noKeys([ ]) // => true

noKeys([ 1 ]) // => false

noKeys(Object.create(null)) // => true

noKeys(function() {}) // => true
```

- Assumes the value you pass is an object
- Does *not* use `hasOwnProperty` (so enumerable prototype keys are counted)
