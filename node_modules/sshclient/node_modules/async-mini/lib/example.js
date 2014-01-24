
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
