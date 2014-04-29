/**********
OPEN FILE
***********/
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
	var url = 'nothing';
	if (data.action === google.picker.Action.PICKED) {
		for(i = 0; i < data.docs.length; i++){
			var fileId = data.docs[i].id;
			console.log(fileId);
			var v = "https://codeyourcloud.com/#"+fileId;
			if(document.URL.indexOf("mobile") !== -1){
				"https://codeyourcloud.com/mobile#"+fileId;
			}
			window.location.href = v;
			location.reload();
			reloadNow();
		}
    }
    return false;
    purge();
}
function redirect(id) {
        var u = "https://codeyourcloud.com/#" + id;
	    window.location.href = url;
}
var developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';
function loadOPicker() {
        gapi.load('picker', {'callback': createOPicker});
}
function loadShare() {
	purge();
	if(doc_url.indexOf("#") !== -1){
		gapi.load('drive-share', function() {
		    purge();
	        var s = new gapi.drive.share.ShareClient('953350323460');
	        s.setItemIds([doc_url.split("#")[1]]);
	        s.showSettingsDialog();
	        purge(); 
		});
		purge();
	}
}
/****
new
****/
function folderPickerNew() {
	window.location.href= "https://codeyourcloud.com/?%22folderId%22:%22" +  myRootFolderId + "%22,%22action%22:%22create";
}
/*****
upload
****/
function uploadPicker() {
    purge();
	gapi.load('picker', {'callback': createUploadPicker});
}
function createUploadPicker() {
	var picker = new google.picker.PickerBuilder()
		.setOAuthToken(gapi.auth.getToken().access_token)
		.enableFeature(google.picker.Feature.NAV_HIDDEN)
		.setAppId('953350323460')
		.addView(new google.picker.DocsUploadView())
		.setOrigin(window.location.protocol + '//' + window.location.host)
		.setDeveloperKey(developerKey)
		.setCallback(uploadCallback)
		.build(); 
	picker.setVisible(true);
	purge();
}
function uploadCallback(data) {
	if (data.action === google.picker.Action.PICKED || data.action === "picked") {
		for(i = 0; i < data.docs.length; i++){
			
		}
    }
    purge();
    return false;
}
