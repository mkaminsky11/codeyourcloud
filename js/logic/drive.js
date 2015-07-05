
function getContentOfFile(theID, model){ //gets the content of the file
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

function _readFile(theID, callback){ //gets the content of the file
    gapi.client.request({'path': '/drive/v2/files/'+theID,'method': 'GET',callback: function ( theResponseJS, theResponseTXT ) {
        var myToken = gapi.auth.getToken();
		var myXHR   = new XMLHttpRequest();
        myXHR.open('GET', theResponseJS.downloadUrl, true );
        myXHR.setRequestHeader('Authorization', 'Bearer ' + myToken.access_token );
        myXHR.onreadystatechange = function( theProgressEvent ) {
            if (myXHR.readyState == 4) {
                if ( myXHR.status == 200 ) {
                	code = myXHR.response;
                	callback(code);
			   	}
            }
        }
        myXHR.send();
        }
    });
}

function getTitle(fileId, model){
	var request = gapi.client.drive.files.get({
    'fileId': fileId
  	});
  	request.execute(function(resp) {
  		the_title = resp.title;
		if(typeof the_title === 'undefined' || typeof the_title === undefined){
			return false;
		}
  		model.getRoot().set("title", model.createString(resp.title));
    	sendTitle(resp.title); //what kind of file is it?
    	title_loaded = true;
    	loaded_title(doc_real);
  	});
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

function save(){
	var content = text.getText();
	if(typeof content !== "undefined"){ //if nothing is "null"
        var contentArray = new Array(content.length);
        for (var i = 0; i < contentArray.length; i++) {
            contentArray[i] = content.charCodeAt(i);
        }
        var byteArray = new Uint8Array(contentArray);
        var blob = new Blob([byteArray], {type: 'text/plain'}); //this is the only way I could get this to work
        var request = gapi.client.drive.files.get({'fileId': current_file});//gets the metadata, which is left alone

        
        request.execute(function(resp) {
            updateFile(current_file,resp,blob,changesSaved);
        });
    }
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

function changesSaved(){
	sendData({
		type: "saved"
	});
}