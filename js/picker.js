var picker = {};

picker.purge = function(){
	$(".dcs-wc-dcs-c-dcs-vc").remove();
};

picker.open = function(){
    if(cloud_use === "drive"){
    	picker.purge();
		gapi.load('picker', {'callback': picker.createOpen});	
	}
	else if(cloud_use === "sky"){
		WL.fileDialog({
	        mode: "open",
	        select: "single"
	    }).then(
	        function (response) {
	            var selected = null;
	            if (response.data.files.length > 0) {
	            	selected = response.data.files[0].id;                            
	            }
	            
	            if(selected !== null){
		            addTab("loading...",selected,false);
	            }
	        },
	        function (responseFailed) {
	        }
	    );
	}
};

picker.createOpen = function(){
	var f = new google.picker.DocsView(google.picker.ViewId.FOLDERS).setParent(drive.root).setSelectFolderEnabled(false);
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
	if(cloud_use === "drive"){
		picker.purge();
		gapi.load('picker', {'callback': picker.createUpload});
	}
	else if(cloud_use === "sky"){
		$('#upload-overlay').velocity('transition.slideDownIn');
	}
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

picker.download = function(id){
	if(id !== "welcome"){
		if(cloud_use === "drive"){
			var request = gapi.client.drive.files.get({
				'fileId': id
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
		else if(cloud_use === "sky"){
			sky.getFile(id, function(res){
				saveFile(res.source);
			});
		}
	}
};

function saveFile(url) {
  // Get file name from url.
  var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = filename; // Set the file name.
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    delete a;
  };
  xhr.open('GET', url);
  xhr.send();
}

picker.share = function(id){
	if(id !== "welcome"){
		picker.purge();
		gapi.load('drive-share', function() {
			picker.purge();
		    var s = new gapi.drive.share.ShareClient('953350323460')
		    s.setItemIds(id)
		    s.showSettingsDialog();
		});
	}
};

picker.saveDest = "";

picker.saveAs = function(){
	if(cloud_use === "drive"){
		$("#file-name").val($("#title").val());
		$('#saveas-overlay').velocity('transition.slideDownIn');
	}
	else if(cloud_use === "sky"){
		$("#file-name").val($("#title").val());
		$('#saveas-overlay').velocity('transition.slideDownIn');
	}
};

picker.saveAsClicked = function(){
	$('#saveas-overlay').velocity('transition.slideUpOut');
	if(cloud_use === "drive"){
		picker.purge();
		gapi.load('picker', {'callback': picker.createSaveAs});
	}
	else if(cloud_use === "sky"){
		sky.saveAs();
	}
}

picker.createSaveAs = function(){
	var docsView = new google.picker.DocsView().setIncludeFolders(true) .setMimeTypes('application/vnd.google-apps.folder').setSelectFolderEnabled(true).setParent(drive.root);
	var _picker = new google.picker.PickerBuilder().setOAuthToken(gapi.auth.getToken().access_token).setAppId('953350323460').addView(docsView).setOrigin(window.location.protocol + '//' + window.location.host).setDeveloperKey(developerKey).setCallback(picker.saveAsCallback).build(); 
	_picker.setVisible(true);
	picker.purge();
};


picker.saveAsCallback = function(data) {
	if (data.action === google.picker.Action.PICKED || data.action === "picked") {
		for(i = 0; i < data.docs.length; i++){
			picker.saveDest = data.docs[0].id;
			var file_name = $("#file-name").val();
			insert_saveas(editor().getValue(), file_name, picker.saveDest);
		}
    }
    picker.purge();
    return false;
};