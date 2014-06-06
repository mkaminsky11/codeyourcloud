/*===========
OPENING
============*/
var developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';
function purge(){
    $(".dcs-wc-dcs-c-dcs-vc").remove();
}
function open_picker() {
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
			window.location = "https://codeyourcloud.com/realtime#"+fileId;
		}
    }
    purge();
}

/*=============
UPLOADING
=============*/
function upload_picker() {
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
/*===============
DOWNLOAD
==============*/
function download_file() {
  var fileId = current;
  var request = gapi.client.drive.files.get({
    'fileId': fileId
  });
  request.execute(function(resp) {
    window.location.assign(resp.webContentLink);
  });
  sendMessage("file downloaded", "success");
} 

/*===========
SHARE
===========*/
function show_share() {
	purge();
	gapi.load('drive-share', function() {
		purge();
	    var s = new gapi.drive.share.ShareClient('953350323460');
	    s.setItemIds(current);
	    s.showSettingsDialog();
        purge(); 
	});
	purge();
}