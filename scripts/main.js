var server;
//
var CLIENT_ID = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/userinfo.profile'];
var ok = false;
var myRootFolderId = null;
var TOpen = false;
/************
AUTHORIZATION
***********/
//this should refresh the token every 300000 milliseconds = 3000 seconds = 50 minutes 
window.onbeforeunload = function () {
	if($("#note").html() !== "All Changes Saved To Drive" || $("#note").html() === "Saving..." && doc_url !== "https://codeyourcloud.com/"){
		//it's ok
		var didTurnOff = false;
		if(isWelcome === false){
			if(TOpen === true){
				TogetherJS(this);
				didTurnOff = true;
			}
			return "You Have Unsaved Changes. Are Your Sure You Want To Exit?";
		}
	}
	else{
		if(TOpen && isWelcome === false){
			TogetherJS(this);
		}
		window.onbeforeunload = undefined;
	}
}
window.setInterval(function(){
	refreshToken();
},3000000);
function refreshToken() {
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate':true},tokenRefreshed);
	window.setInterval(function(){
		refreshToken();
	},3000000);
}
function tokenRefreshed(result){
}
function handleClientLoad() {
	setPercent("0");
	$("#loading").html("Authorizing...");
	checkAuth();
}	
function checkAuth() {
	setPercent("10");
	$("#loading").html("Checking authorization...");
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleAuthResult);
}
function handleAuthResult(authResult) {
	setPercent("30");
	$("#loading").html("Checking results...");
	if (authResult) {
		loadClient(test);
	} else {;
		window.location.href = 'https://codeyourcloud.com/about'; 
	}
}
function loadClient(callback) {
	setPercent("60");
	$("#loading").html("Loading Google Drive...");
	gapi.client.load('drive', 'v2', callback);
}
function test() {
	setPercent("65");
	$("#loading").html("Loading user info...");
	var request = gapi.client.drive.about.get();
	request.execute(function(resp) {
			myRootFolderId = resp.rootFolderId;
			userName = resp.name;
			$("#user_p").html(userName);
			try{
				userUrl = resp.user.picture.url;
				$("#pic_img").attr("src", userUrl);
			}
			catch(e){
			}
			openInit();
			userId = resp.user.permissionId;
			$("#user_id_p").html(userId);
			TogetherJS.refreshUserData();
			//
			var total_q = resp.quotaBytesTotal;
			var user_q = resp.quotaBytesUsedAggregate;
			var product_q = Math.round(user_q/total_q * 100);
			$("#knob").val(product_q).trigger('change');
			$("#knob").val(product_q+"%");
	});
}
/***********
BROWSER DATA
************/
function getB() {
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    var browser = M.join(' ');
	if(browser.indexOf("MSIE") !== -1){
		window.location.href = "https://codeyourcloud.com/error/browser";
	}
	else{
		if(browser.indexOf("Chrome") !== -1){

		}
		if(browser.indexOf("Firefox") !== -1){

		}
		if(browser.indexOf("Opera") !== -1){

		}
	}
}
/*********
SAVE FILE
**********/
function save(){
	saveNoSend();
	sendSave();
}
function saveNoSend(){
	refreshTodo("");
	if(ok && !isWelcome){
		setState("saving");
		var theID = current;
		saveFile(theID, codeMirror.getValue());
	}
}
/*************
INITIALIZATION
*************/
function openInit(){
	setPercent("75");
	initBoot();
	var url = doc_url;
	if(url.indexOf("#") === -1 && url.indexOf("?") === -1){
		welcome()	
	}
	else{
		if(url.indexOf("#state") === -1){
			if(url.indexOf("#") !== -1 && url.indexOf("?") === -1){
				document.getElementById("will_close").style.visibility="visible";
				isWelcome = false;
				var theID = doc_url.split("#")[1];
				try{
				    getContentOfFile(theID);
				}
				catch(e){
				    badType();
				}
				getTitle(theID);
				}
				if(url.indexOf("#") === -1 && url.indexOf("?") !== -1 && url.indexOf("ssh") === -1){
					//console.log("with query");
					if(url.indexOf("action%22:%22open") !== -1){
						var temp1 = doc_url.split("%5B%22")[1];
						var temp2 = temp1.split("%22")[0];
						//console.log(temp2);
						openFile(temp2);
					}
					if(url.indexOf("action%22:%22create") !== -1){
						var temp1 = url.split("%22folderId%22:%22")[1];
						var FI = temp1.split("%22,%22action%22")[0];
						insertNewFile(FI);	
					}
				}
		}
		else{
			//console.log("default");
			welcome();
		}
	}
}
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
            updateFile(fileId,resp,blob,changesSaved);
        });
    }
}
/***********
DOWNLOAD FILE
************/
function downloadFile() {
if(ok){
  var fileId = current;
  var request = gapi.client.drive.files.get({
    'fileId': fileId
  });
  request.execute(function(resp) {
    window.location.assign(resp.webContentLink);
  });
  sendMessage("file downloaded", "success");
}
}
function goBrowser(){
   var current_url = $("#url_input").val()
    if(current_url.indexOf("https://") !== -1){
        try{
            $("#browser_window").attr('src', current_url);
        }
        catch(e){
            $("#browser_window").attr('src', 'https://codeyourcloud.com/error/browser/https.html');
        }
    }
    else{
        if(current_url.indexOf("http://") === -1){
            $("#url_input").val("https://"+current_url);
            try{
                $("#browser_window").attr('src', "https://"+current_url);
            }
            catch(e){
                $("#browser_window").attr('src', 'https://codeyourcloud.com/error/browser/https.html');
            }
        }
        else{
            $("#browser_window").attr('src', 'https://codeyourcloud.com/error/browser/https.html');
        }
    }
}