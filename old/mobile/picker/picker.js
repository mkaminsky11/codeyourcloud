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
	if(window.location.href.indexOf("#") === -1){
		loadOPicker();
	}
	else{
		$("#svg").removeClass("hide");
	}
}

function purge(){
    $(".dcs-wc-dcs-c-dcs-vc").remove();
}
function loadOPicker() {
    purge();
	gapi.load('picker', {'callback': createOPicker});
}
function createOPicker() {
	var picker = new google.picker.PickerBuilder()
		.setOAuthToken(gapi.auth.getToken().access_token)
		.setAppId('953350323460')
		.addViewGroup(
            		new google.picker.ViewGroup(google.picker.ViewId.DOCS))
		.addViewGroup(
            		new google.picker.ViewGroup(google.picker.ViewId.FOLDERS))
		.addViewGroup(
                        new google.picker.ViewGroup(google.picker.ViewId.RECENTLY_PICKED))
		.setOrigin(window.location.protocol + '//' + window.location.host)
		.setDeveloperKey(developerKey)
		.setCallback(pickerOCallback)
		.build(); 
	picker.setVisible(true);
	purge();
}
function pickerOCallback(data) {
	if (data.action === google.picker.Action.PICKED) {
		for(i = 0; i < data.docs.length; i++){
			var fileId = data.docs[i].id;
			
			window.location.href = "https://codeyourcloud.com/mobile/picker#" + fileId;
			
		}
    }
    else if(data.action === google.picker.Action.CANCEL){
    	window.location.href= "https://codeyourcloud.com/mobile/picker#cancel";
    }
    return false;
    purge();
}