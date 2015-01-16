/*
NODEBOT: a bot for ssh-chat	
*/

//LOAD ALL NECESSARY MODULES
var nick = "node";
var comma = nick + ",";
var sshKey = "../../../../root/.ssh/id_rsa";
var chatServer = "chat.shazow.net";
var Connection = require("ssh2");
var conn = new Connection();
var math = require('mathjs');
var weather = require('weather-js');
var upsidedown = require('upsidedown');
var hn = require("hn.js");
var request = require('request');
var global = require('./const.js');
var fs = require('fs');

conn.on("ready", function() {
	conn.shell(function(err, stream) {
		if (err) throw err;

		stream.on("end", function() {
				process.exit(0);
		});

		stream.on("data", function(data) {

		});
	});
});

conn.connect({
	host: chatServer,
	port: 22,
	username: nick,
	privateKey: fs.readFileSync(sshKey),
	passphrase: "passhere",
	readyTimeout: 9999
});