$(window).resize(function() {
	var width = $("#screen").width();
	$("#svg2").css("width", width + "px");
	var mid = Math.floor(width / 2);
	$("#svg2").css("margin-left", "calc(50% - "+mid+"px)");
	
	//height bar = 58
	//height all = 641
	
	var up = Math.floor($("#svg2").height() * (58/641) - 5);
	$("#svg2").css("margin-bottom", up + "px");
});

var width = $("#screen").width();
$("#svg2").css("width", width + "px");
var mid = Math.floor(width / 2);
$("#svg2").css("margin-left", "calc(50% - "+mid+"px)");

var up = Math.floor($("#svg2").height() * (58/641) - 5);
$("#svg2").css("margin-bottom", up + "px");

//$("h1").fitText();
$("#logos").fitText();



function web(){
	
	$("#screen").velocity({
		opacity: 0
	}, { 
		duration: 500,
		complete: function(){
			$("#screen").attr("src","images/web_record.gif");
			$("#screen").css("width","80%");
			$("#screen").css("left","10%");
			
			$("#screen").velocity({
				opacity: 1
			}, { duration: 500 });
		}
	});
}

function mobile(){
	$("#screen").velocity({
		opacity: 0
	}, { 
		duration: 500,
		complete: function(){
			$("#screen").attr("src","images/mobile.png");
			$("#screen").css("width","50%");
			$("#screen").css("left","25%");
			
			$("#screen").velocity({
				opacity: 1
			}, { duration: 500 });
		}
	});
}


var ok = true;

/*******
CHECK IF LOGGED IN
*********/
var is_logged_in = false;
function check_login(){
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleLogin);
}
function handleLogin(authResult) {
	if (!authResult.error) {
		is_logged_in = true;
	} 
	else {
		is_logged_in = false;
	}
}
function go(){
	if(is_logged_in){
		window.location.href = "https://codeyourcloud.com";
	}
	else{
		redirect();
	}
}
/*********
COMMENTS
*********/
var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("open");
};
connection.onmessage = function (message) {
	console.log(json);

	try {
		var json = JSON.parse(message.data);
		if(json.type === "ok"){
		}
	}
	catch(e){}
}
function comment(){
	var name = strip(document.getElementById("comment_name").value);
	var mail = strip(document.getElementById("comment_mail").value);
	var text = strip(document.getElementById("comment_comment").value);

	
	connection.send(JSON.stringify({type: "comment", sender: name, email: mail, comment: text}));
	document.getElementById("comment_name").value = "";
	document.getElementById("comment_mail").value = "";
	document.getElementById("comment_comment").value = "";
}
function resetForm(){
	document.getElementById("comment_name").value = "";
	document.getElementById("comment_mail").value = "";
	document.getElementById("comment_comment").value = "";	
}
function strip(string){
	var ret = string.split("(").join("").split(")").join("");
	ret = ret.split("{").join("").split("}").join("");
	ret = ret.split("+").join("").split("-").join("");
	ret = ret.split(";").join("").split("<").join("").split(">").join("");
	return ret;
}
/*******
REDIRECT
*******/
var CLIENT_ID = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file'];
function handleClientLoad() {
	checkAuth();
}	
function checkAuth() {
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleAuthResult);
}
function handleAuthResult(authResult) {
	if (authResult) {
		// Access token has been successfully retrieved, requests can be sent to the API
		loadClient(test);
	} 
	else {
		redirect();
	}
}
function loadClient(callback) {
	gapi.client.load('drive', 'v2', callback);
}
function test() {
	var request = gapi.client.drive.about.get();
		request.execute(function(resp) {
	});	
	window.location.href = 'https://codeyourcloud.com'; 
}
var Environment = {
    //mobile or desktop compatible event name, to be used with '.on' function
    TOUCH_DOWN_EVENT_NAME: 'mousedown touchstart',
    TOUCH_UP_EVENT_NAME: 'mouseup touchend',
    TOUCH_MOVE_EVENT_NAME: 'mousemove touchmove',
    TOUCH_DOUBLE_TAB_EVENT_NAME: 'dblclick dbltap',

    isAndroid: function() {
        return navigator.userAgent.match(/Android/i);
    },
    isBlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    isIOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    isOpera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    isWindows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    isMobile: function() {
        return (Environment.isAndroid() || Environment.isBlackBerry() || Environment.isIOS() || Environment.isOpera() || Environment.isWindows());
    }
};

function redirect(){
	window.location.href="https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.install + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&state=%2Fprofile&redirect_uri=https%3A%2F%2Fcodeyourcloud.com&response_type=token&client_id=953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com";
}
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-47415821-1', 'codeyourcloud.com');
ga('send', 'pageview');



//chart

/*
var colors = ["#E74C3C", "#2ECC71", "#3498DB", "#9B59B6", "#E67E22", "#1ABC9C", "#34495E"];
var color_index = 0;
window.setInterval(function(){
	color_index++;
	if(color_index >= colors.length){
		color_index = color_index - colors.length;
	}

	$("#main").velocity({
		backgroundColor: colors[color_index]
	},{
		duration: 700
	});
}, 3000);
*/

