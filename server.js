"user strict";
process.title = 'codeyourcloud';
var webSocketsServerPort = 8080;
var fs = require('fs');
var webSocketServer = require('websocket').server;
var https = require('https');
var options = {
	key: fs.readFileSync("../key.pem"),
	cert: fs.readFileSync("../cert.pem"),
	ca: [fs.readFileSync("../ca.pem")]
};
var server = https.createServer(options, function(req, res){
	console.log("request");
}); //options

server.listen(webSocketsServerPort, function() {
    
});
var wsServer = new webSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});


var sessionIndex = [];
//for every client, the index of the session
/*
the index is the id
the actual connections
*/
var FILE = [];
/*
the fileids of the respectice clients
LINES UP WITH ARRAYS
*/
var sessions = [];
/*
stores the indexes of the people in various sessions
*/
var total = 0;

var clients = [];
/*
#############
CONNECTING
#############
1. you get the client id
2. SERVER gets the fileid, locates the proper session and FILE
2a. if there is no fileid, MAKE ONE
3. index added to the proper session
###################
SAVING TO ALL PEOPLE IN A SESSION
###################
1. get client id
2. all of the people in the session, except for the original person, SAVE
!remember...the session is the INDEXES which can be located in the clients array
*/
//
wsServer.on('request', function(request) {
    if(request.origin === "https://codeyourcloud.com"){
    var connection = request.accept(null, request.origin);
    connection.id = ++total;
    if(clients.length < connection.id){
	    clients.push(connection);
    }
    /********
    THE IMPORTANT PART
    ********/
    connection.on('message', function(message) {
        try{
        	var json = JSON.parse(message.utf8Data);
        	if(json.type === "request"){
	        	if(json.data === "init"){
		        	addToSession(json.session, connection.id);
		        	connection.send(JSON.stringify({type: "init", id: connection.id, session: sessionIndex[connection.id-1]}));
	        	}
        	}
        	if(json.type === "command"){
	        	if(json.command === "save"){
		        	var array = sessions[sessionIndex[connection.id - 1]];
		        	for(var i = 0; i < array.length; i++){
		        		if(array[i] !== connection.id){
			        		clients[array[i]-1].send(JSON.stringify({type:"command",command:"save"}));
			        		console.log("*");
			        	}
		        	}
	        	}
	        	if(json.command === "rename"){
		        	var newTitle = json.title;
		        	var array = sessions[sessionIndex[connection.id - 1]];
		        	for(var i = 0; i < array.length; i++){
		        		if(array[i] !== connection.id){
			        		clients[array[i]-1].send(JSON.stringify({type:"command",command:"rename", title: newTitle}));
			        	}
		        	}
	        	}
	        	if(json.command === "mode"){
		        	var newMode = json.mode;
		        	var array = sessions[sessionIndex[connection.id - 1]];
		        	for(var i = 0; i < array.length; i++){
		        		if(array[i] !== connection.id){
			        		clients[array[i]-1].send(JSON.stringify({type:"command",command:"mode", mode: newMode}));
			        	}
		        	}
	        	}
				if(json.command === "theme"){
		        	var newTheme = json.theme;
		        	var array = sessions[sessionIndex[connection.id - 1]];
		        	for(var i = 0; i < array.length; i++){
		        		if(array[i] !== connection.id){
			        		clients[array[i]-1].send(JSON.stringify({type:"command",command:"theme", theme: newTheme}));
			        	}
		        	}
	        	}
        	}
        	if(json.type === "comment"){
	        	var text = json.comment;
	        	var name = json.sender;
	        	var mail = json.email;
	        	//
	        	var output = name + "\n" + mail + "\n" + text + "\n*******************************\n";
	        	fs.appendFile('comments.txt', output, function (err) {

				});
        	}
        	/*
        	WORK ON THIS
        	*/
		    if(json.type === "update"){
			    var array = sessions[sessionIndex[connection.id - 1]];
		        for(var i = 0; i < array.length; i++){
			        clients[array[i]-1].send(JSON.stringify({type:"update", name: json.name}));
		        }
		    }
		    if(json.type === "return"){
		    
		    }
	}
        catch(e){
        }
    }
    );
    // user disconnected
    connection.on('close', function(connection) {
        /*
    	try{
			var index = connection.id - 1;
			var id = connection.id;
			var s = sessionIndex[index];
			sessionIndex.splice(index, 1);
			clients.splice(index, 1);
	   
			var ind = sessions[s].indexOf(id);
			sessions[s].splice(ind, 1);
			if(session[s].length === 0){
				sessions.splice(s,1);
			}
			FILE.splice(s, 1);

		}
		catch(e){}*/
    });
 
function addToSession(session, id){
	for(var i = 0; i < FILE.length; i++){
		if(FILE[i] === session){
			sessionIndex.push(i);
			sessions[i].push(id);
			return;	
		}
	}
	addSession(session);
	addToSession(session, id);
}
function addSession(session){
	FILE.push(session);
	var index = FILE.indexOf(session);
	sessions[index] = [];
}
function removeSession(session){
	var index = FILE.indexOf(session);
	//
	FILE.splice(index,1);
	sessions.split(index,1);
}
}
});
