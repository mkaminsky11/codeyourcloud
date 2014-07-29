var folder_to_insert = "";

function getParents(fileId, callback) {
  var request = gapi.client.drive.parents.list({
    'fileId': fileId
  });
  request.execute(function(resp) {
  	try{
    	callback(resp.items[0].id);
    }
    catch(e){
    	parent_error();
    }
    console.log(resp);
  });
}

function getFile(fileId, callback, goal, id){
	var request = gapi.client.drive.files.get({
	    'fileId': fileId
	  });
	  request.execute(function(resp) {
	    callback(resp, goal, id);
	  });
}


function retrieveAllFiles(callback) {
  var retrievePageOfFiles = function(request, result) {
    request.execute(function(resp) {
      result = result.concat(resp.items);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gapi.client.drive.files.list({
          'pageToken': nextPageToken
        });
        retrievePageOfFiles(request, result);
      } else {
        callback(result);
      }
    });
  }
  var initialRequest = gapi.client.drive.files.list();
  retrievePageOfFiles(initialRequest, []);
}


function retrieveAllFilesInFolder(folderId, callback) {
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
        callback(result, folderId);
      }
    });
  }
  var initialRequest = gapi.client.drive.children.list({
      'folderId' : folderId
    });
  retrievePageOfChildren(initialRequest, []);
}







function getContentOfFile(theID, model){ //gets the content of the file
	console.log("init");
    gapi.client.request({'path': '/drive/v2/files/'+theID,'method': 'GET',callback: function ( theResponseJS, theResponseTXT ) {
        var myToken = gapi.auth.getToken();
		var myXHR   = new XMLHttpRequest();
        myXHR.open('GET', theResponseJS.downloadUrl, true );
        myXHR.setRequestHeader('Authorization', 'Bearer ' + myToken.access_token );
        myXHR.onreadystatechange = function( theProgressEvent ) {
            if (myXHR.readyState == 4) {
                if ( myXHR.status == 200 ) {
                	code = myXHR.response;
                    setValue(code); //sets the value of the codemirror
                    model.getRoot().set("cursors", model.createList());
                    model.getRoot().set("text", model.createString(code));
                    model.getRoot().set("chat", model.createList());
                    init_loaded = true;
                    loaded_realtime(doc_real);
                    getTitle(theID, model);
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
		sendP(resp.items);
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
    	sendTitle(resp.title); //what kind of file is it?
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
	folder_to_insert = folderId;
	
	var content = "";
	var contentArray = new Array(content.length);
    for (var i = 0; i < contentArray.length; i++) {
    	contentArray[i] = content.charCodeAt(i);
    }
    var byteArray = new Uint8Array(contentArray);
    var blob = new Blob([byteArray], {type: 'text/plain'}); //this is the only way I could get this to work
	insertFile(blob, fileInserted);
}

function fileInserted(d) {
	//get folderid
	var FI = folder_to_insert;
    renameFile(d.id, d.id+".txt");
	if(FI !== myRootFolderId){	
		insertFileIntoFolder(FI, d.id);
		removeFileFromFolder(myRootFolderId,d.id);
	}
	sendNew(d.id);
	folder_to_insert = "";
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
function insertFile(fileData, callback) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': "Untitled.txt",
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

function save(){
	var content = text.getText();
	if(typeof content !== "undefined"){ //if nothing is "null"
        var contentArray = new Array(content.length);
        for (var i = 0; i < contentArray.length; i++) {
            contentArray[i] = content.charCodeAt(i);
        }
        var byteArray = new Uint8Array(contentArray);
        var blob = new Blob([byteArray], {type: 'text/plain'}); //this is the only way I could get this to work
        var request = gapi.client.drive.files.get({'fileId': current});//gets the metadata, which is left alone

        
        request.execute(function(resp) {
            updateFile(current,resp,blob,changesSaved);
        });
    }
}

function changesSaved(){
	were_changes = false;
	sendData({
		type: "saved"
	});
}

function insertPermission(fileId, value, type, role) {
  var body = {
    'value': value,
    'type': type,
    'role': role
  };
  var request = gapi.client.drive.permissions.insert({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) { 
  	sendData({
	  	type: "new_p",
	  	p: resp
  	});
  });
}

function removePermission(fileId, permissionId) {
  var request = gapi.client.drive.permissions.delete({
    'fileId': fileId,
    'permissionId': permissionId
  });
  request.execute(function(resp) { });
}


function sharedWithMe(){
	searchAll("sharedWithMe and not '"+myEmail+"' in owners",sharedWithMeCallback);
}


function searchAll(s, callback) {
  var retrievePageOfFiles = function(request, result) {
    request.execute(function(resp) {
      result = result.concat(resp.items);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gapi.client.drive.files.list({
          'pageToken': nextPageToken,
          'q': s
        });
        retrievePageOfFiles(request, result);
      } else {
        callback(result);
      }
    });
  }
  var initialRequest = gapi.client.drive.files.list();
  retrievePageOfFiles(initialRequest, []);
}

function sharedWithMeCallback(data){
	var ret = [];
	var e = myEmail;
	for(var i = 0; i < data.length; i++){
		try{
			var r = false;
			for(var a = 0; a < data[i].owners.length; a++){
				if(data[i].owners[a].emailAddress !== e){
					r = true;
				}
			}
			
			
			if(r){
				var f = false;
				if(data[i].mimeType === "application/vnd.google-apps.folder"){
					f = true;
				}
				var to_push = {
					name: data[i].title,
					id: data[i].id,
					folder:	f,
					date: data[i].modifiedDate,
					mime: data[i].mimeType
				};
				ret.push(to_push);
			}
		}
		catch(e){
		}
	}
	
	sendData({
		type: "shared",
		data: ret
	});
}

function insert_saveas(content, title, folderId){
	saveas_t = title;
	saveas_d = folderId;
	var contentArray = new Array(content.length);
    for (var i = 0; i < contentArray.length; i++) {
    	contentArray[i] = content.charCodeAt(i);
    }
    var byteArray = new Uint8Array(contentArray);
    var blob = new Blob([byteArray], {type: 'text/plain'});
    console.log("ok");
	insertFile(blob, saveas_inserted);
}

function saveas_inserted(d) {
	//get folderid
	var folder_id = saveas_d;
    renameFile(d.id, saveas_t);
    removeFileFromFolder(d.parents[0].id,d.id);
	insertFileIntoFolder(folder_id, d.id);
		
	
	sendData({
		type: "new",
		id: d.id
	});
}