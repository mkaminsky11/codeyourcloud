/*================
store google drive functions
================*/
function getContentOfFile(theID, model){ //gets the content of the file
    current = theID;
    gapi.client.request({'path': '/drive/v2/files/'+theID,'method': 'GET',callback: function ( theResponseJS, theResponseTXT ) {
        var myToken = gapi.auth.getToken();
		var myXHR   = new XMLHttpRequest();
        myXHR.open('GET', theResponseJS.downloadUrl, true );
        myXHR.setRequestHeader('Authorization', 'Bearer ' + myToken.access_token );
        myXHR.onreadystatechange = function( theProgressEvent ) {
            if (myXHR.readyState == 4) {
                if ( myXHR.status == 200 ) {
                	code = myXHR.response;
                    editor.setValue(code); //sets the value of the codemirror
                    model.getRoot().set("cursors", model.createList());
                    model.getRoot().set("text", model.createString(code));
                    model.getRoot().set("chat", model.createList());
                    init_loaded = true;
                    loaded_realtime(doc_real);
                    getTitle(theID, model);
                    getP(theID);
			   	}
            }
        }
        myXHR.send();
        }
    });
}
function getP(fileId) {
	var request = gapi.client.drive.permissions.list({
		'fileId': fileId
	});
	request.execute(function(resp) {
		var ret = false;
		for(var i = 0; i < resp.items.length; i++){
			if(resp.items[i].id === userId || resp.items[i].id === "anyone" || resp.items[i].id === "anyoneWithLink" || resp.items[i].emailAddress === myEmail){
				ret = true;
			}
		}
		if(ret === false){
			window.location = "https://codeyourcloud.com/error/permission";
		}
	});
}
function getTitle(fileId, model){
	var request = gapi.client.drive.files.get({
    'fileId': fileId
  	});
  	request.execute(function(resp) {
  		the_title = resp.title;
  		$("title").html(title);
		if(typeof the_title === 'undefined' || typeof the_title === undefined){
			location.href = "https://codeyourcloud.com/error/fileNotFound";
			return false;
		}
  		model.getRoot().set("title", model.createString(resp.title));
    	check_mode(resp.title); //what kind of file is it?
    	title_loaded = true;
    	loaded_title(doc_real);
  	});
}

function updateFile(fileId, fileMetadata, fileData, callback) { //is the callback necessary?
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var base64Data = btoa(reader.result);

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

function renameFile(fileId, newTitle) {
  var body = {'title': newTitle};
  var request = gapi.client.drive.files.patch({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) {
  });
}

/*=============
NEW FILE
============*/
function insertNewFile(folderId) {
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
function insertFile(fileData, folderId, callback) {
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