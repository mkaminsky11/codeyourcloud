/**********************
GET CONTENTS OF A FILE
**********************/
function getContentOfFile(theID){ //gets the content of the file
    if(online){
    current = theID;
    gapi.client.request({'path': '/drive/v2/files/'+theID,'method': 'GET',callback: function ( theResponseJS, theResponseTXT ) {
        var myToken = gapi.auth.getToken();
		//userInfoInit(myToken);
        //console.log(myToken);
		var myXHR   = new XMLHttpRequest();
        myXHR.open('GET', theResponseJS.downloadUrl, true );
        myXHR.setRequestHeader('Authorization', 'Bearer ' + myToken.access_token );
        myXHR.onreadystatechange = function( theProgressEvent ) {
            if (myXHR.readyState == 4) {
                if ( myXHR.status == 200 ) {
                	var code = myXHR.response;
                    editor.setValue(code, -1); //sets the value of the codemirror
                    if(code === ""){
                        wasBlank = true;
                    }
                    getP(theID);
               		setState("saved");
			   		ok = true;
			   		setPercent("100");
			   		sendMessage("good to go!");
			   		refreshTodo();
			   	}
            }
        }
        myXHR.send();
        }
    });
    }
}
function getTitle(fileId){
    if(online){
	var request = gapi.client.drive.files.get({
    'fileId': fileId
  	});
  	request.execute(function(resp) {
  		title = resp.title;
  		$("title").html(title);
		if(typeof title === 'undefined' || title === "undefined"){
			document.location.href = "https://codeyourcloud.com/error/fileNotFound";
			return false;
		}
  		document.getElementById('renameInput').value = title;
    		checkFileName(resp.title);
  	});
    }
}
/***************
CREATE NEW FILE
***************/
function createNewFile() {
    if(online){
    var t = "untitled" + ".txt";
    gapi.client.load('drive', 'v2', function() {
        var request = gapi.client.request({
            'path': '/drive/v2/files',
            'method': 'POST',
            'body':{
                "title" : t,
                "description" : "A file"
            }
        });
        request.execute(function(resp) { 
        });
    });
    }
}
function insertNewFile(folderId) {
	setPercent("85");
	var content = " ";
	var contentArray = new Array(content.length);
    for (var i = 0; i < contentArray.length; i++) {
    	contentArray[i] = content.charCodeAt(i);
    }
    var byteArray = new Uint8Array(contentArray);
    var blob = new Blob([byteArray], {type: 'text/plain'}); //this is the only way I could get this to work
	insertFile(blob, folderId, fileInserted);
}
function fileInserted(d) {
	setPercent("100");
	//get folderid
	var query = window.location.href.split("?")[1];
	var FI = query.split("%22")[3];
    renameFile(d.id, d.id+".txt");
	if(FI !== myRootFolderId){	
		insertFileIntoFolder(FI, d.id);
		removeFileFromFolder(d.parents[0].id,d.id);
	}
	window.location = "https://codeyourcloud.com#"+d.id;
}
function insertFileIntoFolder(folderId, fileId) {
  if(online){
  var body = {'id': folderId};
  var request = gapi.client.drive.parents.insert({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) { });
  }
}
function removeFileFromFolder(folderId, fileId) {
  if(online){
  var request = gapi.client.drive.parents.delete({
    'parentId': folderId,
    'fileId': fileId
  });
  request.execute(function(resp) { });
  }
}
function insertFile(fileData, folderId, callback) {
    if(online){
	setPercent("90");
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': folderId + ".txt",
      'mimeType': contentType
    };

    var base64Data = btoa(reader.result);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
      };
    }
    request.execute(callback);
  }
    }
}
function updateFile(fileId, fileMetadata, fileData, callback) { //is the callback necessary?
  if(ok && online){
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var base64Data = btoa(reader.result);
    //console.log(base64Data);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(fileMetadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files/' + fileId,
        'method': 'PUT',
        'params': {'uploadType': 'multipart', 'alt': 'json'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
      };
    }
    request.execute(callback);
  }
	}
}
function getP(fileId) {
    if(online){
	var request = gapi.client.drive.permissions.list({
		'fileId': fileId
	});
	request.execute(function(resp) {
		var ret = false;
		for(i = 0; i < resp.items.length; i++){
			console.log(resp.items[i]);
			if(resp.items[i].id === userId || resp.items[i].id === "anyone" || resp.items[i].id === "anyoneWithLink"){
				ret = true;
			}
		}
		console.log(ret);
		if(ret === false){
			window.location = "https://codeyourcloud.com/error/permission";
		}
	});
    }
}
function changesSaved() {
	sendMessage("changes saved!", "success")
	setState("saved");
}
function renameFile(fileId, newTitle) {
    if(online){
  var body = {'title': newTitle};
  var request = gapi.client.drive.files.patch({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) {
    sendMessage('new Title: ' + resp.title, "success");
  });
    }
}