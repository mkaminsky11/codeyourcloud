# Lightweight Asynchronous Error Handling v2 for Node.js (LAEH2)

### News for 0.3.1

`_e()` can now optionally be used as `_e('some string with %s formatting', 'nice')`.

## Important Changes for >= 0.3.0

### Change 1

The `_x()` and `_e()` functions are no longer placed to the global space, and you need to explicitly declare them in your module as `var _x = laeh2._x;` and `var _e = laeh2._e;` (that is, if you need to use `_e` at all).

The reason for this is that in some situations, Node/V8 had trouble to garbage-collect data created in functions wrapped by the `_x()` function, although this works perfectly fine when you reassign the `_x` function locally in your module.

This change breaks existing code, but it's very easy to fix. Bug report for Node/V8 for this issue wasn't filled yet.

### Change 2

The `capturePrevious` flag now defaults to the opposite of `process.env.NODE_ENV === 'production'`, which means that if you want to have asynchronous stack-traces captured in production, you need to use `.capturePrevious(true)` explicitly.

Another change here is that when `capturePrevious` is `true`, the stack-traces are no longer stored inside Error instances, but serialized during the capturing phase. This solves another mysterious garbage-collecting problem, similar to the one described above. This also adds a tiny extra overhead to the capturing phase.


## Evolution

### 1. Unprotected callback code

```js
function someContext(arg, arg, callback) {

	asyncFunction(arg, arg, function(err, data) {
		// err is not checked but should be (a common case)
		throw new Error('fail'); // uncaught - will exit Node.js
	}

}
```

### 2. Manualy protected callback code, lots of clutter

```js
function someContext(arg, arg, callback) {

	asyncFunction(arg, arg, function(err, data) {
		if(err)
			callback(err);
		else {
			try {
				throw new Error('fail');
			}
			catch(e) {
				callback(e); // caught - return control manually
			}
		}
	}

}
```

### 3. LAEH2, an elegant solution

```js
function someContext(arg, arg, callback) {

	asyncFunction(arg, arg, _x(callback, true, function(err, data) {
		throw new Error('fail');
	}));
}
```

Parameters for the `_x` LAEH2 wrapper function:

* `callback`: in case of error, return control to callback (if you pass `null`, the callback will be taken from the last parameter of the function in the third argument, if that parameter is a `function`
* `true`: automatically check callback's err parameter and pass it directly to the parent callback if true
* `function`: the asynchronously executed callback function to wrap


### 4. Optional Goodies

LAEH2 stores the stacktrace of the thread that initiated the asynchronous operation which in turn called the callback. This stacktrace is then appended to the primary stacktrace of the error which was thrown in the callback, or the error which was passed to the callback by the asynchronous function.

LAEH2 then presents the stacktrace in a minified format, with optional hiding of frames of the `laeh2.js` itself, of the Node.js' core library files, shortens the often repeating string `/node_modules/` into `/$/`, and removes the current directory path prefix from the file names in the stacktrace.


## Usage

Install LAEH2:

	npm install laeh2

And then wrap your asynchronous callback with the `_x` function:

```js
var fs = require('fs');
var laeh = require('laeh2').leanStacks(true);
var _e = laeh._e;
var _x = laeh._x;

var myfunc = function(param1, paramN, cb) {
	fs.readdir(__dirname, _x(cb, true, function(err, files) { // LINE #7
		// do your things here..
		_e('unexpected thing'); // throw your own errors, etc. LINE #9
	}));
}

myfunc('dummy', 'dummy', function(err) { // LINE #13
	if(err)
		console.log(err.stack);
});
```

This will print:

	unexpected thing < ./ex1.js(9) << ./ex1.js(7 < 13)

The async boundary is (by default) marked with `<<`.

If we disable the "hiding" by passing `false` as the first parameter, the output will be something like:

	unexpected thing < /Users/ypocat/Github/laeh2/lib/laeh2.js(31) < ./ex1.js(9) < /Users/ypocat/Github/laeh2/lib/laeh2.js(56) << /Users/ypocat/Github/laeh2/lib/laeh2.js(45) < ./ex1.js(7 < 13) < module.js(432 < 450 < 351 < 310 < 470) < node.js(192)

If we enable hiding, and add some metadata:

```js
_e('unexpected thing', { msg: 'my metadata', xyz: 123 });
```

..the output, when configured with `.leanStacks(true, '\t')`, will be:

	unexpected thing < {
	        "msg": "my metadata",
	        "xyz": 123
	} ./ex2.js(9) << ./ex2.js(7 < 13)

And when configured with just `.leanStacks(true)`:

	unexpected thing < {"msg":"my metadata","xyz":123} ./ex3.js(9) << ./ex3.js(7 < 13)

This is a nice terse format which is also good when you store error messages to database or services like Loggly (with JSON input), as it saves a lot of space.

For comparison, this would be printed without using `.leanStacks`:

	Error: unexpected thing
	    at /Users/ypocat/Github/laeh2/lib/laeh2.js:31:8
	    at /Users/ypocat/Github/laeh2/example/ex4.js:9:3
	    at Object.oncomplete (/Users/ypocat/Github/laeh2/lib/laeh2.js:56:9)

(Notice that the parent stack trace is missing.)

The `leanStacks(hiding, prettyMeta)` call is optional, the `hiding` will hide stack frames from Node's core .js files and from `laeh2.js` itself. The `prettyMeta` is the third parameter for the `JSON.stringify` function, which is used to serialize your metadata objects (see below), and leaving it empty or null will serialize your metadata objects in-line.

Added in LAEH2 are 2 new parameters to `.leanStacks`: `frameSeparator` and `fiberSeparator`, which default to `' < '` and `' << '`, respectively. But if you use tools which rely on the newlines in your stack traces, you can set these accordingly, e.g. to `'\n'` and `'\n<<\n'`, respectively, e.g. `.leanStacks(true, null, '\n', '\n<<\n')`:

	unexpected thing
	./ex6.js(9)
	<<
	./ex6.js(7 < 13)

### Notes

If you don't want a new Error object to be created each time a function wrapped by `_x()` is called (you are OK to lose the stack-trace of the async caller), use the following call:

```js
var laeh = require('laeh2').capturePrevious(false);

// you can also chain these, e.g.:

var laeh = require('laeh2').capturePrevious(false).leanStacks(true);
```

### Warning

Don't use LAEH to wrap non-asynchronous callbacks, and especially non-asynchronous loop callbacks, as this can lead to nasty runtime errors. Consider e.g.:

```js
[ 'one', 'two', 'three' ].forEach(_x(cb, false, function(v) {
	throw new Error('unexpected');
}));
```

This will call the `cb` callback three times (effectively forking your control flow), because the `Array.forEach()` will not stop looping when the callback is called. Correct approach here is to not wrap the synchronous callback in `_x`, and let the parent block (which should be protected by `_x`, by `try/catch`, or by its synchronous parent block) handle any exceptions.

### Express.js

When coding handlers or params for Express.js or Connect, just pass the `next` parameter as the eventual callback, e.g.:

```js
app.param('reg', function(req, res, next, email) {
	db.hgetall('reg:' + email, _x(next, true, function(err, reg) {
		if(!reg.lickey)
			return next('No such registration');
		req.reg = reg;
		next();
	}));
});
```

Now any error thrown in the callback called by Redis' `hgetall` will be captured and passed to the `next()` function. Likewise, should Redis respond with an error passed via the `err` parameter, this parameter is automatically checked and the error will be passed to the `next()` function. Easy peasy LAEH squeezy.

Note: There is no need to `_x`-wrap the callback passed to the `app.param()` call (or `app.get()` etc.), as Express.js wraps and handles this first level automatically.

### Other

The `_e(err, meta)` function is just a convenient error checking, wrapping and throwing. E.g. `_e('something')` will throw `new Error('something')` and `_e(null)` will not do anything. The `meta` parameter is an optional accompanying information for the error to be thrown, which is then displayed when you let LAEH to display your errors using the `leanStacks()` call.

In the `_x(cb, chk, func)`, the func is your callback to be wrapped. If it follows the node convention of `func(err, args)`, you can pass `chk` as true, which will automatically check for the `err` to be null, and call the eventual callback if it isn't null. The eventual callback is passed as the `cb` argument, or if omitted, it is tried to be derived from the last argument passed to the function you are wrapping, e.g. if the signature is `func(err, args, cb)`, the `cb` is taken from its arguments.
