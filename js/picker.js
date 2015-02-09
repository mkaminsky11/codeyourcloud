/*===========
OPENING
============*/
var developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';
function purge(){
    $(".dcs-wc-dcs-c-dcs-vc").remove();
	//it sometimes happens that semitransparent layers build up from the different dialog. This just removes them.
}
function open_picker() {
    purge();
	gapi.load('picker', {'callback': createOPicker});
}

function createOPicker() {

	
	var f = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
	f.setParent(myRootFolderId);
	f.setSelectFolderEnabled(false);
	
	var s  = new google.picker.DocsView();
	s.setSelectFolderEnabled(false);
	s.setOwnedByMe(false);
	//.setOwnedByMe

	var picker = new google.picker.PickerBuilder()
		.setOAuthToken(gapi.auth.getToken().access_token)
		.setAppId('953350323460')
		

		.addViewGroup(
            f
         )
        .addViewGroup(
        	s
        )
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
			
			addTab("loading...",fileId,false);
		}
    }
    purge();
}

/*=============
UPLOADING
=============*/
var upload_desination = "";



function upload_picker(){
	purge();
	gapi.load('picker', {'callback': uploadPicker});
}


function uploadPicker(){
	
	var picker = new google.picker.PickerBuilder()
		.setOAuthToken(gapi.auth.getToken().access_token)
		.enableFeature(google.picker.Feature.NAV_HIDDEN)
		.setAppId('953350323460')
		.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
		.addView(new google.picker.DocsUploadView()
             .setIncludeFolders(true) 
         ) 
		.setOrigin(window.location.protocol + '//' + window.location.host)
		.setDeveloperKey(developerKey)
		.setCallback(upCallback)
		.build(); 
	picker.setVisible(true);
	purge();
}

function upCallback(data){
	if (data.action === google.picker.Action.PICKED || data.action === "picked") {
		//console.log(data.docs[0]);
		//data.docs[0].id <---go here
		var fileId = data.docs[0].id;
		
		addTab("loading...",fileId,false);
    }
    purge();
    return false;
}
/*===============
DOWNLOAD
==============*/
function download_file() {
  var fileId = current_file;
  var request = gapi.client.drive.files.get({
    'fileId': fileId
  });
  request.execute(function(resp) {
  	//console.log(resp);
    window.location.assign(resp.webContentLink);
  });
  
  Messenger().post({
	  message: 'File downloaded!',
	  type: 'success',
	  showCloseButton: true
	});
} 

/*===========
SHARE
===========*/
function show_share() {
	purge();
	gapi.load('drive-share', function() {
		purge();
	    var s = new gapi.drive.share.ShareClient('953350323460');
	    s.setItemIds(current_file);
	    s.showSettingsDialog();
        purge(); 
	});
	purge();
}

/*======
SAVE AS
=======*/
var save_as_destination = "";

function showSaveAsPicker(){
	purge();
	gapi.load('picker', {'callback': createSaveAsPicker});
}

function createSaveAsPicker(){
	var docsView = new google.picker.DocsView()
	  .setIncludeFolders(true) 
	  .setMimeTypes('application/vnd.google-apps.folder')
	  .setSelectFolderEnabled(true)
	  .setParent(myRootFolderId);
	
	var picker = new google.picker.PickerBuilder()
		.setOAuthToken(gapi.auth.getToken().access_token)
		.setAppId('953350323460')
		.addView(docsView)
		.setOrigin(window.location.protocol + '//' + window.location.host)
		.setDeveloperKey(developerKey)
		.setCallback(saveAsCallback)
		.build(); 
	picker.setVisible(true);
	purge();
}

function saveAsCallback(data) {
	if (data.action === google.picker.Action.PICKED || data.action === "picked") {
		for(i = 0; i < data.docs.length; i++){
			//console.log(data.docs[i]);
			//folder id = data.docs[0].id;
			save_as_destination = data.docs[0].id;
			saveas_ok();
		}
    }
    purge();
    return false;
}
function saveas_ok(){
	var content = editor().getValue();
	var title = "Untitled.txt";
	var folder = save_as_destination;
	insert_saveas(content, title, folder);
}
