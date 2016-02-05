"user strict";
process.title = 'codeyourcloud';
var webSocketsServerPort = 8080;
var fs = require('fs');

var webSocketServer = require('websocket').server;
var https = require('https');
var options = {
	key: fs.readFileSync("/etc/ssl/www.codeyourcloud.com.key"),
	cert: fs.readFileSync("/etc/ssl/www.codeyourcloud.com.crt"),
	ca: [fs.readFileSync("/etc/ssl/www.codeyourcloud.com-geotrust.crt")]
};
var server = https.createServer(options, function(req, res){
	console.log("request");
});
server.listen(webSocketsServerPort, function() {
});
var wsServer = new webSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
var total = 0;
var sessions = [];
wsServer.on('request', function(request) {
    if(request.origin.indexOf("codeyourcloud.com") !== -1){
	    var connection = request.accept(null, request.origin);
		connection.id = ++total;
	    connection.on('message', function(message) {
	        try{
	        	var json = JSON.parse(message.utf8Data);	
			}
			catch(e){
			}
		});
	connection.on('close', function(reasonCode, description){}); 
	}
});