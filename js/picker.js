var picker = {};

picker.purge = function(){
	$(".dcs-wc-dcs-c-dcs-vc").remove();
};

picker.open = function(){
    picker.purge();
	gapi.load('picker', {'callback': picker.createOpen});	
};

picker.createOpen = function(){
	var f = new google.picker.DocsView(google.picker.ViewId.FOLDERS).setParent(myRootFolderId).setSelectFolderEnabled(false);
	var s  = new google.picker.DocsView().setSelectFolderEnabled(false).setOwnedByMe(false);
	var _picker = new google.picker.PickerBuilder().setOAuthToken(gapi.auth.getToken().access_token).setAppId('953350323460').addViewGroup(f).addViewGroup(s).addViewGroup(new google.picker.ViewGroup(google.picker.ViewId.RECENTLY_PICKED)).setOrigin(window.location.protocol + '//' + window.location.host).setDeveloperKey(developerKey).setCallback(picker.openCallback).build();
	_picker.setVisible(true);
	picker.purge();
}

picker.openCallback = function(data) {
	var url = 'nothing';
	if (data.action === google.picker.Action.PICKED) {
		for(i = 0; i < data.docs.length; i++){
			var fileId = data.docs[i].id;
			addTab("loading...",fileId,false);
		}
    }
    picker.purge();
};

picker.uploadDestination = "";
picker.upload = function(){
	picker.purge();
	gapi.load('picker', {'callback': picker.createUpload});
};

picker.createUpload = function(){
	var _picker = new google.picker.PickerBuilder().setOAuthToken(gapi.auth.getToken().access_token).enableFeature(google.picker.Feature.NAV_HIDDEN).setAppId('953350323460').enableFeature(google.picker.Feature.MULTISELECT_ENABLED).addView(new google.picker.DocsUploadView().setIncludeFolders(true) ) .setOrigin(window.location.protocol + '//' + window.location.host).setDeveloperKey(developerKey).setCallback(picker.uploadCallback).build(); 
	_picker.setVisible(true);
	picker.purge();
};

picker.uploadCallback = function(data){
	if (data.action === google.picker.Action.PICKED || data.action === "picked") {
		var fileId = data.docs[0].id;
		addTab("loading...",fileId,false);
    }
    picker.purge();
    return false;
};

picker.download = function(){
	if(current_file !== "welcome"){
		var request = gapi.client.drive.files.get({
			'fileId': current_file
	  	});
	  	request.execute(function(resp) {
	  		window.location.assign(resp.webContentLink);
		});
		Messenger().post({
			message: 'File downloaded!',
			type: 'success',
			showCloseButton: true
		});
	}
};

picker.share = function(){
	if(current_file !== "welcome"){
		picker.purge();
		gapi.load('drive-share', function() {
			picker.purge();
		    var s = new gapi.drive.share.ShareClient('953350323460')
		    s.setItemIds(current_file)
		    s.showSettingsDialog();
		});
	}
};

picker.saveDest = "";

picker.saveAs = function(){
	picker.purge();
	gapi.load('picker', {'callback': picker.createSaveAs});
};

picker.createSaveAs = function(){
	var docsView = new google.picker.DocsView().setIncludeFolders(true) .setMimeTypes('application/vnd.google-apps.folder').setSelectFolderEnabled(true).setParent(myRootFolderId);
	var _picker = new google.picker.PickerBuilder().setOAuthToken(gapi.auth.getToken().access_token).setAppId('953350323460').addView(docsView).setOrigin(window.location.protocol + '//' + window.location.host).setDeveloperKey(developerKey).setCallback(picker.saveAsCallback).build(); 
	_picker.setVisible(true);
	picker.purge();
};


picker.saveAsCallback = function(data) {
	if (data.action === google.picker.Action.PICKED || data.action === "picked") {
		for(i = 0; i < data.docs.length; i++){
			picker.saveDest = data.docs[0].id;
			insert_saveas(editor().getValue(), "Untitled.txt", picker.saveDest);
		}
    }
    picker.purge();
    return false;
};