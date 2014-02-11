/*********
CHECK IF LOGGED IN
*********/
var is_logged_in = false;
function check_login(){
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleLogin);
}
function handleLogin(authResult) {
	if (authResult) {
		//ok
		$("#login_button").html('Start Editing');
		is_logged_in = true;
	} 
	else {
		//
		$("#login_button").html('<i class="fa fa-google-plus"></i> | Login with Google');
	}
}
function go(){
	if(is_logged_in){
		window.location.href = "https://codeyourcloud.com";
	}
	else{
		handleClientLoad();
	}
}
/*********
COMMENTS
*********/
var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("open");
};
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
	return string.replace(/(<([^>]+)>)/ig,"");
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
function redirect(){
	 window.location.href="https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.install + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&state=%2Fprofile&redirect_uri=https%3A%2F%2Fcodeyourcloud.com&response_type=token&client_id=953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com";
 }
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-47415821-1', 'codeyourcloud.com');
ga('send', 'pageview');
/**********
MESSENGER
**********/
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'flat'
}
function sendMessage(message, type){
    Messenger().post({message:message,showCloseButton: true, hideAfter: 5, type: type});
}