/**********************
GET CONTENTS OF A FILE
**********************/
function getContentOfFile(theID){ //gets the content of the file
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
                    codeMirror.setValue(code); //sets the value of the codemirror
               		setState("saved");
			   		ok = true;
			   		setPercent("100");
			   		refreshTodo();
			   	}
            }
        }
        myXHR.send();
        }
    });
}
function getTitle(fileId){
	var request = gapi.client.drive.files.get({
    'fileId': fileId
  	});
  	request.execute(function(resp) {
  		title = resp.title;
		if(typeof title === 'undefined' || title === "undefined"){
			document.location.href = "https://codeyourcloud.com/error/fileNotFound";
			return false;
		}
  		document.getElementById('renameInput').value = title;
    		checkFileName(resp.title);
  	});
}
/***************
CREATE NEW FILE
***************/
function createNewFile() {
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
        	//console.log(resp); 
        });
    });
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
	insertFile(blob, fileInserted, folderId);
}
function fileInserted(d) {
	setPercent("100");
	//console.log(d);
	var temp1 = doc_url.split("%22folderId%22:%22")[1];
        var FI = temp1.split("%22,%22action%22")[0];
	if(FI !== myRootFolderId){	
		insertFileIntoFolder(FI, d.id);
		removeFileFromFolder(d.parents[0].id,d.id);
	}
	openFile(d.id);
}
function insertFileIntoFolder(folderId, fileId) {
  var body = {'id': folderId};
  var request = gapi.client.drive.parents.insert({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) { });
}
function removeFileFromFolder(folderId, fileId) {
  var request = gapi.client.drive.parents.delete({
    'parentId': folderId,
    'fileId': fileId
  });
  request.execute(function(resp) { });
}
function insertFile(fileData, callback, folderId) {
	setPercent("90");
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': "untitled.txt",
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
        //console.log(file)
      };
    }
    request.execute(callback);
  }
}
function updateFile(fileId, fileMetadata, fileData, callback) { //is the callback necessary?
  if(ok){
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
    if (!callback) {//this isn't necessary
      callback = function(file) {
        //console.log(file) //for some reason, this is important
      };
    }
    request.execute(callback);//not needed
  }
	}
}
function getP(fileId) {
	var request = gapi.client.drive.permissions.list({
		'fileId': fileId
	});
	request.execute(function(resp) {
		console.log(resp.items);
		console.log(resp.items.length);
		var ret = false;
		for(i = 0; i < resp.items.length; i++){
			console.log(resp.items[i]);
			if(resp.items[i].id === userId || resp.items[i].id === "anyone" || resp.items[i].id === "anyoneWithLink"){
				ret = true;
			}
		}
		console.log(ret);
		if(ret === false){
			window.location.href = "https://codeyourcloud.com/error/permission";
		}
	});
}
function changesSaved() {
	console.log("changes saved");
	setState("saved");
}
function checkDir(folderId, testString, callback) {
  var retrievePageOfChildren = function(request, result) {
    request.execute(function(resp) {
      result = result.concat(resp.items);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gapi.client.drive.children.list({
          'folderId' : folderId,
          'pageToken': nextPageToken
        });
        retrievePageOfChildren(request, result);
      } else {
        callback(result);
      }
    });
  }
  var initialRequest = gapi.client.drive.children.list({
      'folderId' : folderId
    });
  retrievePageOfChildren(initialRequest, []);
}