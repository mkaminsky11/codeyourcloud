# sshclient

a tiny, simple but durable wrapper for the [ssh2](https://github.com/mscdex/ssh2) node.js lib.

early version, only deployment related commands are supported: `writeFile()` and `exec()`.

for the (optional) use of `_x()`, see [laeh2](https://github.com/ypocat/laeh2).

## use 1

```js
var opts = {

    host: 'myhost',
    port: 22,
    username: 'ubuntu',
    privateKey: fs.readFileSync('./somekey.pem'),

    debug: true, // optional
    console: console, // optional, allows logger overriding

    session: [
        { op: 'writeFile', path: '/mydir/myfile.txt', body: 'my utf8 body, or a buffer\n' },
        { op: 'exec', command: 'chmod o+w /mydir/myfile.txt' }
    ]
};

sshclient.session(opts, _x(cb, true, function(err) {
    console.log('done');
    cb();
}));

```

notes:
- optional for `exec()`: `canFail: true`, continue if the command fails
- optional for `writeFile()`: `flags: 'flags'`, [see here](http://nodejs.org/docs/latest/api/fs.html#fs_fs_open_path_flags_mode_callback), e.g. `'w'` for overwrite, `'a'` for append (on `'a*'` flags, pointer is automatically positioned to the end of the file)
- optional for `writeFile()`: `mode: 0666`, [see here](http://nodejs.org/docs/latest/api/fs.html#fs_class_fs_stats) (only the setable ones)

## use 2

```js
var opts = {

    host: 'myhost',
    port: 22,
    username: 'ubuntu',
    privateKey: fs.readFileSync('./somekey.pem'),

    debug: true, // optional
    console: console // optional, allows logger overriding
};

sshclient.session(opts, _x(cb, true, function(err, ses) {
   
    async.series([

        _x(null, false, function(cb) {
            ses.writeFile('/mydir/myfile.txt', 'my utf8 body, or a buffer\n', cb);
        }),
        
        _x(null, false, function(cb) {
            ses.exec('chmod o+w /mydir/myfile.txt', cb);
        }),

    ], _x(cb, false, function(err) {
        ses.quit(); // need to close the session here on both error and success
        cb(err);
    }));

}));
```
notes:
- optional for `writeFile()`: `flags` and `mode` (sig: `writeFile(path, bodyOrBuff, flags, mode, cb)` - see [use 1](#use-1) for explanation

