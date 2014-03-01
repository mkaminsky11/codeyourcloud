var server;
//
var CLIENT_ID = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive'];
var ok = false;
var myRootFolderId = null;
var TOpen = false;
var done = false;
/************
AUTHORIZATION
***********/
window.onbeforeunload = function () {
	if($("#note").html() !== "All Changes Saved To Drive" || $("#note").html() === "Saving..." && doc_url !== "https://codeyourcloud.com/"){
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
		if(TOpen && !isWelcome){
			TogetherJS(this);
		}
		window.onbeforeunload = undefined;
	}
}
//this should refresh the token every 300000 milliseconds = 3000 seconds = 50 minutes 
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
    if(online){
        setPercent("0");
	    $("#loading").html("Authorizing...");
	    checkAuth();
    }
}	
function checkAuth() {
	setPercent("10");
	$("#loading").html("Checking authorization...");
	try{
		try{
			gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleAuthResult);
		}
		catch(e){
			if(!done){
				checkAuth();
			}
		}
	}
	catch(e){
		if(!done){
			checkAuth();
		}
	}
}
function handleAuthResult(authResult) {
	done = true;
	setPercent("30");
	$("#loading").html("Checking results...");
	if (authResult) {
		loadClient(test);
	} 
	else {
		window.location.href = 'https://codeyourcloud.com/dashboard'; 
	}
}
function loadClient(callback) {
	setPercent("60");
	$("#loading").html("Loading Google Drive...");
	gapi.client.load('drive', 'v2', callback);
}
function test() {
	//if # but not ?
	if(doc_url.indexOf("#") !== -1 && doc_url.indexOf("?") === -1){
		get_info();
		getContentOfFile(doc_url.split("#")[1]);
		getTitle(doc_url.split("#")[1]);
	}
	//if neither
	else if(doc_url.indexOf("#") === -1 && doc_url.indexOf("?") === -1){
		welcome();
		get_info();
	}
	//? but not #
	else if(doc_url.indexOf("?") !== -1 && doc_url.indexOf("#") === -1){
		var query = window.location.href.split("?")[1];
		if(query.indexOf("create") !== -1){
			var query_folder_id = query.split("%22")[3];
			insertNewFile(query_folder_id);
		}
		else if(query.indexOf("open") !== -1){
			var query_id = query.split("%22")[3];
			window.location.href = "https://codeyourcloud.com#" + query_id;
		}
		else{
			welcome();
		}
	}
}
function get_info(){
	setPercent("65");
    $("#loading").html("Loading user info...");
    var request = gapi.client.drive.about.get();
    request.execute(function(resp) {
        myRootFolderId = resp.rootFolderId;
        $("#loading").html("Retrieved root folder...");
        userName = resp.name;
        $("#loading").html("Got user name");
        $("#user_p").html(userName);
        try{
            userUrl = resp.user.picture.url;
            $("#pic_img").attr("src", userUrl);
            $("#loading").html("Retrieved profile picture...");
        }
        catch(e){}
        try{
            userId = resp.user.permissionId;
            $("#loading").html("Retrieved user id...");
            $("#user_id_p").html(userId);
        }
        catch(e){}
        TogetherJS.refreshUserData();
        var total_q = resp.quotaBytesTotal;
        $("#loading").html("Retrieved user quota...");
        var user_q = resp.quotaBytesUsedAggregate;
        $("#loading").html("Retrieved user usage...");
        var product_q = Math.round(user_q/total_q * 100);
        $("#knob").val(product_q).trigger('change');
        $("#knob").val(product_q+"%");
    });
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
function saveFile(fileId, content){
    //console.log(content);
    if(typeof content !== "undefined" && online){ //if nothing is "null"
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
    if(!online){
	    $('#offlineModal').modal('show');
    }
}
/*************
INITIALIZATION
*************/
function openInit(){
	setPercent("75");
	var url = doc_url;
	if(url.indexOf("#") === -1 && url.indexOf("?") === -1){
		welcome()	
	}
	else{
			if(url.indexOf("#") !== -1 && url.indexOf("?") === -1){
				document.getElementById("will_close").style.visibility="visible";
				isWelcome = false;
				var theID = doc_url.split("#")[1];
				getContentOfFile(theID);
				getTitle(theID);
			}
			else if(url.indexOf("#") === -1 && url.indexOf("?") !== -1){
				if(url.indexOf("action%22:%22open") !== -1){
					var temp1 = doc_url.split("%5B%22")[1];
					var temp2 = temp1.split("%22")[0];
					openFile(temp2);
			    }
				else if(url.indexOf("action%22:%22create") !== -1){
					var temp1 = url.split("%22folderId%22:%22")[1];
					var FI = temp1.split("%22,%22action%22")[0];
					insertNewFile(FI);	
				}
				else{
					welcome();
				}
			}
	}
}
/***********
DOWNLOAD FILE
************/
function downloadFile() {
if(ok && online){
  var fileId = current;
  var request = gapi.client.drive.files.get({
    'fileId': fileId
  });
  request.execute(function(resp) {
    window.location.assign(resp.webContentLink);
  });
  sendMessage("file downloaded", "success");
}
if(!online){
	    $('#offlineModal').modal('show');
    }
}
/*********
BROWSER
*********/
function goBrowser(){
    if(online){
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
}
/**********
ONLINE/OFFLINE
***********/
var online = true;
function isOnline() {
    var status = navigator.onLine; 
    if(status !== online){
	    //if there is a change
	    online = status;
	    if(online === true){
		    sendMessage("online", "success");
	    }
	    else{
		    sendMessage("offline", "error");
	    }
    }
};

setInterval(isOnline, 500);
isOnline();
/**********
PDF
**********/
function to_pdf(){
    var doc = new jsPDF();
    //doc.text(20, 20, codeMirror.getValue());
    var s = codeMirror.getValue().split("\n");
    var temp = "";
    var count = 0;
    for(var i = 0; i < s.length; i++){
	    if(count === 35 || i === s.length-1){
		    count = 0;
		    doc.text(20,20,temp);
		    temp="";
		    doc.addPage();
	    }
	    else{
		    temp = temp + "\n" + s[i];
		    count++;
	    }
    }
    doc.save('PDF.pdf');
}
/*********
RANDOM
**********/
function generate(){
    $("#lorem").html("");
    var lorem = new Lorem;
    lorem.type = Lorem.TEXT;
    lorem.query = $("#num_lorem").val() + $("#lorem_choose").val();
    lorem.createLorem(document.getElementById('lorem'));
}
$('.no_submit').submit(function(e) {
    e.preventDefault();
});
/*********
ANALYTICS
********/
function start_anaytics(){
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', 'UA-47415821-1', 'codeyourcloud.com');
			ga('send', 'pageview');
}