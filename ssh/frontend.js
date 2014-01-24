var connection = new WebSocket('ws://64.207.146.34:8080');
var sshSession = "";
connection.onopen = function () {
	console.log("open");
	//
	check_cookie();
};
connection.onmessage = function (message){
	try {
		var json = JSON.parse(message.data);
		console.log(json);
		if(json.type === "ok"){
			showMain();
		}
		if(json.type === "bad"){
			showLogin();
		}
		if(json.type === "ssh"){
			if(json.ssh === "folder"){
				var array = json.array;
				for(var i = 0; i < array.length; i++){
					addFolder(path, array[i]);
				}
			}
		}
	}
	catch(e){
	
	}
}
connection.onerror = function (error) {
	//uh oh...
};
var port;
var host;
var login;
var pass;
function LOGIN() {
	port = document.getElementById("port").value;
	host = document.getElementById("host").value;
	login = document.getElementById("user").value;
	pass = document.getElementById("pass").value;
	//
	console.log("login with info");
	$.cookie('port', port, {expires: 1});
	$.cookie('host', host, {expires: 1});
	$.cookie('login', login, {expires: 1});
	$.cookie('password', pass, {expires: 1});
	if(port === "" ){
		port = 22;
	}
	else{
		port = Number(port);
	}
	if(host === "" || login === "" || pass === ""){
		bad_login();
		return;
	}
	//ok...for now
	connection.send(JSON.stringify({type: "ssh", ssh: "init", port: port, host:host, login:login, password:pass}));
}
function login_from_cookie(){
	if(port === "" ){
		port = 22;
	}
	else{
		port = Number(port);
	}
	if(host === "" || login === "" || pass === ""){
		bad_login();
		return;
	}
	//ok...for now
	connection.send(JSON.stringify({type: "ssh", ssh: "init", port: port, host:host, login:login, password:pass}));
}
function bad_login(){
	
}
function check_cookie(){
        var remember = $.cookie('remember');
        if (remember == 'remember') 
        {
            port = $.cookie('port');
	    host = $.cookie('host');
	    login = $.cookie('login');
            pass = $.cookie('password');
            // autofill the fields
            login_from_cookie();
        }
	else{
		console.log("blank");
		remeber = $.cookie('remember', 'remember');
	}
}
function logout(){
	$.cookie('port', null);
	$.cookie('host', null);
	$.cookie('login', null);
	$.cookie('pasword', null);
	//
	document.getElementById("port").value = "";
	document.getElementById("host").value = "";
	document.getElementById("user").value = "";
	document.getElementById("pass").value = "";
	
	showLogin()();
}
function showLogin(){
	bootHide("main");
	removeClass("login", "hide");
}
function showMain(){
	bootHide("login");
	removeClass("main", "hide");
}
//
//
//
//
//
