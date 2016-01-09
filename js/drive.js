var drive = {};
drive.loaded = false;
drive.logged_in = false;
drive.client_id = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
drive.scopes = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive'];
drive.root = null;
drive.email = null;
drive.username = null;
drive.url = null;
drive.id = null;

drive.load = function(){
  gapi.client.setApiKey(developerKey);
  window.setTimeout(function(){
  	gapi.auth.authorize({'client_id': drive.client_id, 'scope': drive.scopes.join(' '), 'immediate': true}, function(authResult){
		$("#loading-bar").css("width","60%");
  		drive.loaded = true;
  		console.log(authResult);
  		
  		if(window.location.href.indexOf("output=true") !== -1){
  			$("#output-overlay").css("display","block");
  			$("#output-output").html(JSON.stringify(authResult));
  		}
  		
  		if (authResult.status.signed_in === true) {
  			drive.logged_in = true;	} 
  		else {
  			
  		}
  		
  		if(sky.loaded === true){
  			init();
  		}
  	});
  },1);
}

drive.checkAppLogin = function(callback){
	$.ajax("https://codeyourcloud.com/status",{
		method: "GET",
		success: function(data, textStatus, jqXHR){
			callback(data.loggedIn);
		},
		error: function(jqXHR, textStatus, errorThrown){
			throw errorThrown;
		}	
	});
}

drive.loadClient = function() {
	gapi.client.load('drive', 'v2', function(){
		$("#loading-bar").css("width","70%");
		//this need to be refreshed every 55 minutes
		setInterval(function(){
			drive.refresh();
		},3000000);
		
		drive.getInfo();
		var url = window.location.href;
		var query = window.location.href.split("?")[1];
		if(url.indexOf("%22action%22:%22open") !== -1){
			//need to open a file
			var query_id = query.split("%22")[3];
			addTab(query_id,false);
			
		}
		else if(url.indexOf("%22action%22:%22create%22") !== -1){
			//need to create new file
			var query_folder_id = query.split("%22")[3];
			insertNewFile(query_folder_id);
		}
	});
}

drive.refresh = function() {
	gapi.auth.authorize({'client_id': drive.client_id, 'scope': drive.scopes.join(' '), 'immediate':true},function(result){});
}

drive.getInfo = function(){
    var request = gapi.client.drive.about.get();
    request.execute(function(resp) {
		$("#loading-bar").css("width","90%");
        drive.root = resp.rootFolderId;
        try{
        	drive.email = resp.user.emailAddress;
        }
        catch(e){
	        drive.email = "error:unable to fetch email";
        }
        drive.username = resp.name;
        try{
            drive.url = resp.user.picture.url;
            var tempUrl = drive.url;
            if(tempUrl.indexOf("https://") === -1){
	            tempUrl = "https:" + tempUrl;
            }
            if(typeof tempUrl === 'undefined'){
	            drive.url = "https://codeyourcloud.com/images/other/none.jpg";
	            tempUrl = "https://codeyourcloud.com/images/other/none.jpg";
            }
            $("#profile_pic").attr("src",tempUrl);
            
        }
        catch(e){ //fortunately, got the default image
	        drive.url = "https://codeyourcloud.com/images/other/none.jpg";
	        $("#profile_pic").attr("src",drive.url);
        }
        try{
            drive.id = resp.user.permissionId;
            $(".side-pub-link").attr("href", "https://codeyourcloud.com/pub/"+drive.id+"/index.html");
            
        }
        catch(e){}
        $(".root-tree").attr("data-tree-ul", drive.root);
        get_tree(drive.root);
		$("#loading-overlay").css("display","none");
    });
}

//most of these are from Google's website
drive.getFile = function(fileId, callback){
	var request = gapi.client.drive.files.get({
	    'fileId': fileId
	  });
	  request.execute(function(resp) {
		  if(resp.code === 403 || resp.code === "403"){
			  //exponential backoff
			  var sleep = (Math.pow(2,1)*1000) + (Math.round(Math.random() * 1000));
			  window.setTimeout(function(){
				  drive.getFile(fileId, callback);
			  },sleep);
		  }
		  else{
			callback(resp);
		  }
	  });
};

drive.trash = function(fileId){
	var request = gapi.client.drive.files.trash({
		'fileId': fileId
	});
	request.execute(function(resp) {
		if(!resp.error){
			manager.removeTab(fileId);
			get_tree(drive.root);
		}
	});
};

drive.getContentOfFile = function(theID, callback){ //gets the content of the file
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
};

drive.retrieveAllFilesInFolder = function(folderId, callback) {
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
};

//gets the permissions
function getP(fileId) {
	var request = gapi.client.drive.permissions.list({
		'fileId': fileId
	});
	request.execute(function(resp) {
		var ret = false;
		for(var i = 0; i < resp.items.length; i++){
			if(resp.items[i].id === drive.id || resp.items[i].id === "anyone" || resp.items[i].id === "anyoneWithLink" || resp.items[i].emailAddress === drive.email){
				ret = true;
			}
		}
		if(ret === false){
			//if you don't have them....
			window.location = "https://codeyourcloud.com/error/permission";
		}
	});
}


//NEW FILE
var insert_folder_dest = ""; //the destination to insert a new file into

function insertNewFile(folderId) {
	var content = ""; //default text
	insert_folder_dest = folderId; //store it globally :( not best practice
	
	var contentArray = new Array(content.length); //convert it!
    for (var i = 0; i < contentArray.length; i++) {
    	contentArray[i] = content.charCodeAt(i);
    }
    var byteArray = new Uint8Array(contentArray);
    var blob = new Blob([byteArray], {type: 'text/plain'}); //this is the only way I could get this to work
	insertFile(blob, folderId, fileInserted);
}
function fileInserted(d) {
	//this function is triggered once the file is inserted
	//if it's not the defalt, move it to the correct place
	if(insert_folder_dest !== drive.root){	
		insertFileIntoFolder(insert_folder_dest, d.id);
		removeFileFromFolder(d.parents[0].id,d.id);
	}
	
	//great, now add the tab
	addTab(d.id,false);
	
	if(insert_folder_dest === drive.root){
		get_tree(drive.root);
	}
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

function renameFile(fileId, newTitle) {
  //renames the file. DUH
  var body = {'title': newTitle};
  var request = gapi.client.drive.files.patch({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) {
  });
}



function insert_saveas(content, title, folderId){
	//the "save as" function. It just inserts a new file in a new place
	var contentArray = new Array(content.length);
    for (var i = 0; i < contentArray.length; i++) {
    	contentArray[i] = content.charCodeAt(i);
    }
    var byteArray = new Uint8Array(contentArray);
    var blob = new Blob([byteArray], {type: 'text/plain'});
	insertFile(blob, folderId, saveas_inserted);
}

function saveas_inserted(inserted_file) {
	//called once file inserted
	var folder_id = picker.saveDest;
    renameFile(inserted_file.id, $("#file-name").val());
    $("#file-name").val("");
	if(folder_id !== drive.root){	
		insertFileIntoFolder(folder_id, inserted_file.id);
		removeFileFromFolder(inserted_file.parents[0].id,inserted_file.id);
	}
	
	addTab(inserted_file.id,false);
}

drive.updateFile = function(fileId, fileMetadata, fileData, callback) { //is the callback necessary?
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
