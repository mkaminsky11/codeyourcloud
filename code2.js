/**********
OPEN FILE
***********/
function loadOPicker() {
	gapi.load('picker', {'callback': createOPicker});
}
function createOPicker() {
	//go
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
}
function pickerOCallback(data) {
	var url = 'nothing';
	if (data.action === google.picker.Action.PICKED) {
		for(i = 0; i < data.docs.length; i++){
			//console.log("download url: "+data.docs[i].downloadUrl+" webcontentlink: "+data.docs[i].webContentLink);	
			var fileId = data.docs[i].id;
        	//openFile(fileId);
			console.log(fileId);
			var v = "https://codeyourcloud.com/#"+fileId;
			window.location.href = v;
			location.reload();
			reloadNow();
		}
    }
    return false;
}
function redirect(id) {
        var u = "https://codeyourcloud.com/#" + id;
        //window.open(u,'_blank');
	window.location.href = url;
}
var developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';
function loadOPicker() {
        gapi.load('picker', {'callback': createOPicker});
}
function OpenInNewTab(stuff){

}
init = function() {
	//var once = true;
	var s = new gapi.drive.share.ShareClient('953350323460');
	s.setItemIds([document.URL.split("#")[1]]);
	s.showSettingsDialog()
	//return false;
}
function loadShare() {
	//console.log("window onload");
	if(document.URL.indexOf("#") !== -1){
		gapi.load('drive-share', init);
		//return false;
	}
	//return false;
}
/****
new
****/
function folderPickerNew() {
	//gapi.load('picker', {'callback': createNewPicker});
	window.location.href= "https://codeyourcloud.com/?%22folderId%22:%22" +  myRootFolderId + "%22,%22action%22:%22create";
}
function createNewPicker() {
	//go
	var docsView = new google.picker.DocsView()
		.setIncludeFolders(true) 
		.setMimeTypes('application/vnd.google-apps.folder')
		.setSelectFolderEnabled(true);
	var picker = new google.picker.PickerBuilder()
		.setOAuthToken(gapi.auth.getToken().access_token)
		.enableFeature(google.picker.Feature.NAV_HIDDEN)
		.setAppId('953350323460')
		.addView(docsView)
		.setOrigin(window.location.protocol + '//' + window.location.host)
		.setDeveloperKey(developerKey)
		.setCallback(newCallback)
		.build(); 
	picker.setVisible(true);
}
function newCallback(data) {
	if (data.action === google.picker.Action.PICKED || data.action === "picked") {
		for(i = 0; i < data.docs.length; i++){
			window.location.href= "https://codeyourcloud.com/?%22folderId%22:%22" +  data.docs[i].id + "%22,%22action%22:%22create";
		}
    }
    return false;
}

/*****
upload
****/
function uploadPicker() {
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
}
function uploadCallback(data) {
	if (data.action === google.picker.Action.PICKED || data.action === "picked") {
		for(i = 0; i < data.docs.length; i++){
			
		}
    }
    return false;
}
