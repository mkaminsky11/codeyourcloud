Code Your Cloud
=============
<h3>Goal</h3>
To allow people around the globe to collaborate on coding projects via Google Drive
<h3>Features</h3>
<ul>
  <li>Syntax highlighting</li>
  <li>Collaboration</li>
  <li>Built-in color picker</li>
  <li>HTML preview</li>
  <li>Autocomplete</li>
  <li>Javascript console</li>
  <li>A notepad to jot down ideas</li>
  <li>Built-in todo list</li>
  <li>Browser</li>
  <li>Keyboard shortcuts</li>
  <li>Vim modes</li>
  <li>Preferences</li>
  <li>Google Drive integration</li>
</ul>
<h3>Useful Code Snippets</h3>
<h6>Getting the contents of a Google Drive file by id</h6>
```javascript
function getContentOfFile(theID){ //gets the content of the file
    gapi.client.request({'path': '/drive/v2/files/'+theID,'method': 'GET',callback: function ( theResponseJS, theResponseTXT ) {
    var myToken = gapi.auth.getToken();
		var myXHR   = new XMLHttpRequest();
        myXHR.open('GET', theResponseJS.downloadUrl, true );
        myXHR.setRequestHeader('Authorization', 'Bearer ' + myToken.access_token );
        myXHR.onreadystatechange = function( theProgressEvent ) {
            if (myXHR.readyState == 4) {
                if ( myXHR.status == 200 ) {
                	var content = myXHR.response;
			   	      }
            }
        }
        myXHR.send();
        }
    });
}
```
<h6>Get the title of a file</h6>
```javascript
function getTitle(fileId){
	var request = gapi.client.drive.files.get({
    'fileId': fileId
  	});
  	request.execute(function(resp) {
  		title = resp.title;
  	});
}
```
<h6>Inserting a new file into a folder</h6>
```javascript
function insertNewFile(folderId) {
	var content = " ";
	var FolderId = "";
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
  var FI = FolderId;
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
      };
    }
    request.execute(callback);
  }
}
```
<h6>Saving a file</h6>
```javascript
function saveFile(fileId, content){
    //console.log(content);
    if(typeof content !== "undefined"){ //if nothing is "null"
        var contentArray = new Array(content.length);
        for (var i = 0; i < contentArray.length; i++) {
            contentArray[i] = content.charCodeAt(i);
        }
        var byteArray = new Uint8Array(contentArray);
        var blob = new Blob([byteArray], {type: 'text/plain'}); //this is the only way I could get this to work
        var request = gapi.client.drive.files.get({'fileId': fileId});//gets the metadata, which is left alone
        request.execute(function(resp) {
            //console.log(content);
            updateFile(fileId,resp,blob,changesSaved);
        });
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
```
<h4>See the project so far <a href="https://codeyourcloud.com">here</h4>
<h4>See the about page <a href="https://codeyourcloud.com/about">here</h4>
