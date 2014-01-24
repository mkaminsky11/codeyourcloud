var SCOPES = null;
var CLIENTID = null;
var rootFolderId = null;
var userId = null;
var userName = null;
var userUrl = null;
var theCode = null;
function goauth(clientId, scopes){
	//define values
	CLIENTID = clientId;
	SCOPES = scopes;
}
/*
[declare][finish][double]
----------
----------
AUTHORIZE
---------
*popup[x][x]
*redirect[x][x]
---------
GET TOKEN
---------
*every x seconds[x]
*on demand[x]
---------
GET USER INFO
---------
*root folder[x][x]
*name[x][x]
*userId[x][x]
*profile picture[x][x]
--------
PICKER
--------
*folders[x]
**get folderId[x]
*documents[x]
*images[x]
*upload[x]
--------
DOWNLOAD FILE
--------
*from id[x][x]
--------
GET TITLE
---------
*from fileid[x][x]
--------
GET CONTENTS OF FILE
--------
*from id[x][x]
---------
GET PERMISSIONS OF FILE
---------
*from id[x]
--------
WRITE TO FILE
---------
*title[x]
*content[x]
*...other metadata?
---------
MOVE FILE
---------
*to folderId[x]
----------
REMOVE FILE
----------
*from folder[x]
-----------
ADD FILE
-----------
*to folderId[x]
----------
DELETE FILE
----------
*from fileid[x]
----------
SHARE
-----------
*folderId[x]
----------
CREATE NEW FILE
----------
*in root[x]
*in folderId[x]
*/
/*******
REDIRECT
*******/
goauth.prototype.redirect = function(redirectUrl){
	var url = "https://accounts.google.com/o/oauth2/auth?"; //base
	if(SCOPES === null || CLIENTID === null){
		return "you did not define the scopes or the client id";
	}
	else{
		//scopes
		var scope = "scope=";
		var all_scopes = SCOPES.join("+");
		var rep = all_scopes.split("/").join("%2F");
		var red = rep.split(":").join("%3A");
		var scope = scope + red;
		//state
		var state = "&state=%2Fprofile&";
		//redirect url
		var red = redirectUrl.split("/").join("%2F").split(":").join("%3A");
		var redir = "redirect_uri=" + red;
		//token
		var token = "&response_type=token&";
		//client
		var client = "client_id="+CLIENTID;
	}
	url = url + scope + state + redir + token + client;
	window.location.href= url;
}
/*********
POPUP
********/
goauth.prototype.popup = function(callback){
	gapi.auth.authorize({'client_id': CLIENTID, 'scope': SCOPES.join(' '), 'immediate': true},	function(result){
		handle(result, callback);
	});
}
function handle(result, callback){
	if(result){
		loadClient(callback);
	}
	else{
		gapi.auth.authorize({'client_id': CLIENTID, 'scope': SCOPES, 'immediate': false},function(result){
			handle(result, callback);
		});
	}
}
function loadClient(callback){
	gapi.client.load('drive', 'v2', callback);
}
/********
REFRESH EVERY
**********/
goauth.prototype.token_every = function(time_milli, callback){
	window.setInterval(function(){
		this.refresh_token(callback)
	}, time_milli);
}
/***********
REFRESH
***********/
goauth.prototype.refresh_token = function(callback){
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate':true},callback);
}
/**********
GET USER INFO
************/
//refreshes user info
goauth.prototype.get_user_info = function(){
	var request = gapi.client.drive.about.get();
	request.execute(function(resp) {
		rootFolderId = resp.rootFolderId;
		userName = resp.name;
		userUrl = resp.user.picture.url;
		userId = resp.user.permissionId;
	});
}
goauth.prototype.root_folder = function(){
	return rootFolderId;
}
goauth.prototype.user_name = function(){
	return userName;
}
goauth.prototype.user_id = function(){
	return userId;
}
goauth.prototype.profile_url = function(){
	return userUrl;
}
/***********
PICKER
***********/
//type_array = an array of the types-->{"FILE","DOCS","IMAGES","UPLOAD"...}
//should return the result
goauth.prototype.picker = function(type_array){
	
}
/**********
DOWNLOAD
**********/
goauth.prototype.download_file = function(fileId){
	var request = gapi.client.drive.files.get({
    	'fileId': fileId
	});
	request.execute(function(resp) {
    	window.location.assign(resp.webContentLink);
	});
}
/***********
GET CONTENTS
***********/
goauth.prototype.get_contents = function(fileId){
	var ret = null;
    gapi.client.request({'path': '/drive/v2/files/'+fileId,'method': 'GET',callback: function ( theResponseJS, theResponseTXT ) {
    	var myToken = gapi.auth.getToken();
		var myXHR   = new XMLHttpRequest();
        myXHR.open('GET', theResponseJS.downloadUrl, true );
        myXHR.setRequestHeader('Authorization', 'Bearer ' + myToken.access_token );
        myXHR.onreadystatechange = function( theProgressEvent ) {
            if (myXHR.readyState == 4) {
            //1=connection ok, 2=Request received, 3=running, 4=terminated
                if ( myXHR.status == 200 ) {
                //200=OK
                	console.log("ok");
                	theCode =  myXHR.response;
			   	}
            }
        }
        myXHR.send();
        }
    });
}
goauth.prototype.get_code = function(){
	return theCode;
}
goauth.prototype.get_permission = function(fileId){
	
}
goauth.prototype.set_contents = function(fileId, content){

}
goauth.prototype.set_title = function(fileId, title){
	
}
goauth.prototype.get_title = function(fileId){
	
}
goauth.prototype.move_file = function(fileId, folderId){
	
}
goauth.prototype.add_file = function(fileId, folderId){
	
}
goauth.prototype.remove_file = function(fileId, folderId){
	
}
goauth.prototype.delete_file = function(fileId){
	
}
goauth.prototype.share = function(fileId){
	
}
goauth.prototype.new_file_folder = function(title, folderId){
	
}
goauth.prototype.new_file = function(title){
	
}