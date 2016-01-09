"user strict";
process.title = 'codeyourcloud';
var webSocketsServerPort = 8080;
var fs = require('fs');
var path = require('path');

var webSocketServer = require('websocket').server;
var https = require('https');
var mysql = require('mysql');
var mkdirp = require('mkdirp');
var options = {
	key: fs.readFileSync("../store/www.codeyourcloud.com.key"),
	cert: fs.readFileSync("../store/www.codeyourcloud.com.crt"),
	ca: [fs.readFileSync("../store//www.codeyourcloud.com-geotrust.crt")]
};
var store_p = fs.readFileSync("../note1.txt","utf8").replace("\n","");
var sql = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: store_p,
	database: 'cyc'
});
sql.connect(function(err) {
  if (err) {
  }
});
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
				if(json.type === "survey"){
					var vote = json.vote + "\n";
					fs.appendFile('../survey/ad.txt', vote, function(err){});
				}
				if(json.type === "publish"){
					var user_id = json.id;
					console.log(json.mode);
					if(json.mode === "text/html" || json.mode === "text/x-markdown" || json.mode === "gfm"){
						//if markdown or html
						var lines = json.lines.join("\n");
						var dir = "pub/" + user_id;
						if(pathOk(dir)){
							mkdirp(dir, function (err) {});
							fs.writeFile(dir+"/index.html", lines, function(err) {
								if(err) {
									console.log(err);
								} else {
									connection.send(JSON.stringify({type:"pub"}));
									console.log("The file was saved!");
								}
							}); 
						}
					}
					else if(json.mode === "text/x-stex" || json.mode === "text/x-latex"){
						//latex
						latexToPdf(json.lines, json.id, json.fileId, function(){
							connection.send(JSON.stringify({type:"pub"}));
						});
					}
				}	
			}
			catch(e){
			}
		});
	connection.on('close', function(reasonCode, description){}); 
	}
});

function latexToPdf(lines, userid, fileId, callback){
	var path = "pub/" + userid + "/" + fileId + ".pdf";
	if(pathOk(path) === true){
		var writeStream = fs.createWriteStream(path, { flags : 'w' });
		require("latex")(lines).pipe(writeStream);
		callback();
	}
}

function pathOk(_path){
	var res = path.resolve('.',_path);
	var required = path.resolve('.','pub');
	return (res.indexOf(required) === 0);		
}
