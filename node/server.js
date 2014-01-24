var ws  = require('websocket.io');
var server = ws.listen(3000);

server.on('connection', function (socket) {
  socket.on('message', function () { });
  socket.on('close', function () { });
});
