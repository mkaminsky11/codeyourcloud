var fs = require('fs');
var laeh = require('../lib/laeh2').leanStacks(true);
var _e = laeh._e;
var _x = laeh._x;

var myfunc = function(param1, paramN, cb) {	
	[ 'one', 'two', 'three' ].forEach(_x(cb, false, function(v) {
		if(v != 'one')
			throw new Error('unexpected');
		console.log('array: ' + v);
	}));
};

myfunc('dummy', 'dummy', function(err) { // LINE #13
	console.log('control flow is at myfunc()');
	if(err)
		console.log(err.stack);
});
