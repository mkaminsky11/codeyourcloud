var CLIENT_ID = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive'];
var developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';

var logged_in = null;

function handleClientLoad() {
	checkAuth();
}	
function checkAuth() {
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleAuthResult);
}
function handleAuthResult(authResult) {
	if (authResult) {
		logged_in = true;
		loadClient(init);
	} 
	else {
		logged_in = false;
	}
}
function loadClient(callback) {
	gapi.client.load('drive', 'v2', callback);
}

function init(){
	if(window.location.href.indexOf("#done") === -1 && window.location.href.indexOf("#") !== -1){
		var share = window.location.href.split("#")[1];
		loadShare(share);
	}
	else{
		//done
	}
}
function purge(){
    $(".dcs-wc-dcs-c-dcs-vc").remove();
}
function loadShare(share) {
	purge();
	gapi.load('drive-share', function() {
	    purge();
        var s = new gapi.drive.share.ShareClient('953350323460');
	    s.setItemIds([share]);
	    s.showSettingsDialog();
	    purge(); 
	    console.log("done");
	});
	purge();
}