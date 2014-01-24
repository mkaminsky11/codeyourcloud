

var global = typeof(global) !== 'undefined' ? global : {};
var process = typeof(process) !== 'undefined' ? process : {};
var next = global.setImmediate || process.nextTick || setTimeout;

exports.series = function(funcs, cb) {

    return funcs.length !== undefined ?
        seriesArray(funcs, cb) :
        seriesMap(funcs, cb);
};

function seriesMap(funcs, cb) {

    var keys = Object.keys(funcs);
    var ress = new Object(null);

    function run() {

        if(!keys.length)
            return cb(null, ress);

        var key = keys.shift();
        var func = funcs[key];

        func(function(err, res) {

            if(err)
                return cb(err, ress);

            ress[key] = res;
            next(run);
        });
    }

    run();
}

function seriesArray(funcs, cb) {

    funcs = funcs.slice(0);
    var ress = [];

    function run() {

        if(!funcs.length)
            return cb(null, ress);

        var func = funcs.shift();

        func(function(err, res) {

            if(err)
                return cb(err, ress);

            ress.push(res);
            next(run);
        });
    }

    run();
};

exports.parallel = function(funcs, cb) {

    var c = typeof(funcs) === 'object' ?
        Object.keys(funcs).length : funcs.length;

    var errs = {};
    var has_errs = false;
    var ress = {};

    if(!c)
        cb(null, ress);

    for(var k in funcs) {

        (function() {

            var f = funcs[k];
            var id = k;

            next(function() {

                f(function(err, res) {

                    if(err) {
                        errs[id] = err.stack || err;
                        has_errs = true;
                    }

                    if(res !== undefined)
                        ress[id] = res;

                    c--;

                    if(c == 0)
                        cb(has_errs ? errs : null, ress);
                });
            });
        })();
    }
};
