var ok = true;
function get_info(){
	try{
    	var request = gapi.client.drive.about.get();
    }
    catch(e){
    	ok = false;
    }
    request.execute(function(resp) {
        myRootFolderId = resp.rootFolderId;
        try{
        	var myEmail = resp.user.emailAddress;
        }
        catch(e){
        	redirect();
        }
    });
}

/*******
EMAIL
*******/
function send_mail(mail){
	connection.send(JSON.stringify({type:"mail",mail:mail}));
}
$("#email_input").on('input',function(){
	check_email();	
	$(".thanks").addClass("hide");
});
var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function check_email(){
	var m = $("#email_input").val();
	if(re.test(m)){
		$("#email_input").css("border","none");
		$("#email_button").removeClass("disabled");
	}
	else{
		$("#email_input").css("border","solid thin #e74c3c");
		$("#email_button").addClass("disabled");
	}
}
function go_email(){
	var m = $("#email_input").val();
	if(re.test(m)){
		send_mail(m);
		$("#email_input").val("");
		thanks();
	}
}

function thanks(){
	$(".thanks").removeClass("hide");
}
/*******
CHECK IF LOGGED IN
*********/
var is_logged_in = false;
function check_login(){
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleLogin);
}
function handleLogin(authResult) {
	if (authResult) {
		//ok
		$("#login_button").html('<span class="fa fa-file-code-o"></span> Start Editing');
		is_logged_in = true;
		get_info();
	} 
	else {
		//
		$("#login_button").html('<span class="icon icon-google-plus"></span> | Login with Google');
	}
}
function go(){
	if(ok){
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
	try {
		var json = JSON.parse(message.data);
		if(json.type === "ok"){
			console.log(json.message);
		}
	}
	catch(e){}
}
function comment(){
	$("#comment_name").css("border","none");
	$("#comment_mail").css("border","none");
	$("#comment_comment").css("border","none");
	
	var name = strip(document.getElementById("comment_name").value);
	var mail = strip(document.getElementById("comment_mail").value);
	var text = strip(document.getElementById("comment_comment").value);
	if(mail.indexOf("@") !== -1){
		connection.send(JSON.stringify({type: "comment", sender: name, email: mail, comment: text}));
		document.getElementById("comment_name").value = "";
		document.getElementById("comment_mail").value = "";
		document.getElementById("comment_comment").value = "";
		
		$("#comment_name").css("border","solid thin #2ECC71");
		$("#comment_mail").css("border","solid thin #2ECC71D");
		$("#comment_comment").css("border","solid thin #2ECC71");
		setTimeout(function(){
				$("#comment_name").css("border","none");
				$("#comment_mail").css("border","none");
				$("#comment_comment").css("border","none");
			},1000);
	}
	else{
		$("#comment_mail").css("border","solid thin #E74C3C");
	}
}
function resetForm(){
	document.getElementById("comment_name").value = "";
	document.getElementById("comment_mail").value = "";
	document.getElementById("comment_comment").value = "";	
	
	$("#comment_name").css("border","solid thin #7F8C8D");
	$("#comment_mail").css("border","solid thin #7F8C8D");
	$("#comment_comment").css("border","solid thin #7F8C8D");
	setTimeout(function(){
		$("#comment_name").css("border","none");
		$("#comment_mail").css("border","none");
		$("#comment_comment").css("border","none");
		
	},1000);
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

