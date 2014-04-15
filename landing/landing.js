$(document).ready(function() {
    $('#fullpage').fullpage({
		loopBottom: true,
		navigation: true
    });
});
var CLIENT_ID = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file'];
function check_login(){
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleLogin);
}
function handleLogin(authResult) {
	if (authResult) {
        //window.location.href="https://codeyourcloud.com";
	} 
	else {
		//still not logged in
	}
}
function redirect(){
	window.location.href="https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.install + https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&state=%2Fprofile&redirect_uri=https%3A%2F%2Fcodeyourcloud.com&response_type=token&client_id=953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com";
}