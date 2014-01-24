var fs = require('fs');
var laeh = require('../lib/laeh2').leanStacks(true, '\t');
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