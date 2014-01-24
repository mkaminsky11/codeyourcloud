# Common patterns for asynchronous code, minimalistic version (async-mini)

If you only need `async.series()` and `async.parallel()` in the most simplest, stable and predictable form, then this module is for you.

Update for 2.x: `series()` now supports its first argument to be an object, in which case the result comes back as an object, keyed by the same keys as the argument — this is the same behavior as `parallel()` has. The usage with array is unaffected.

## Usage

	npm install async-mini

```js
var async = require('./async-mini');

var arr = [
    function(cb) {
        cb(null, 'arr 1');
    },
    function(cb) {
        cb(null, 'arr 2');
    }
];

var obj = {
    one: function(cb) {
        cb(null, 'obj 1');
    },
    two: function(cb) {
        cb(null, 'obj 2');
    }
};

async.series([

    function(cb) {
        async.series(arr, cb);
    },
    function(cb) {
        async.series(obj, cb);
    },
    function(cb) {
        async.parallel(arr, cb);
    },
    function(cb) {
        async.parallel(obj, cb);
    }

], function(err, res) {

    console.log(JSON.stringify(res, null, '  '));
});
```

The above code will print:

	[
	  [
	    "arr 1",
	    "arr 2"
	  ],
	  {
	    "one": "obj 1",
	    "two": "obj 2"
	  },
	  {
	    "0": "arr 1",
	    "1": "arr 2"
	  },
	  {
	    "one": "obj 1",
	    "two": "obj 2"
	  }
	]
