
var server;
var CLIENT_ID = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive'];
var myRootFolderId = null;
var done = false;
var changes_made = false;
/************
AUTHORIZATION
***********/
window.onbeforeunload = function () {
	if($("#note").html() !== "All Changes Saved To Drive" || $("#note").html() === "Saving..." && document.URL !== "https://codeyourcloud.com/" && document.URL !== "https://codeyourcloud.com/mobile"){
		var didTurnOff = false;
		if(isWelcome === false){
			if(isTOpen === true){
				TogetherJS(this);
				didTurnOff = true;
			}
			return "You Have Unsaved Changes. Are Your Sure You Want To Exit?";
		}
	}
	else{
		if(isTOpen && !isWelcome){
			TogetherJS(this);
		}
		window.onbeforeunload = undefined;
	}
}
//this should refresh the token every 300000 milliseconds = 3000 seconds = 50 minutes 
setInterval(function(){
	refreshToken();
},3000000);
function refreshToken() {
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate':true},tokenRefreshed);
}
function tokenRefreshed(result){
}
autoSave();
function autoSave(){
	setTimeout(function(){
		if(document.URL.indexOf("#") !== -1 && auto_save){
			if(changes_made){
				save();
			}
			autoSave();
		}
	}, auto_save_int);
}
function handleClientLoad() {
        setPercent("0");
	    //$("#loading").html("Authorizing...");
	    checkAuth();
}	
function checkAuth() {
	setPercent("10");
	//$("#loading").html("Checking authorization...");
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
	//$("#loading").html("Checking results...");
	if (authResult) {
		loadClient(init);
	} 
	else {
		window.location = 'https://codeyourcloud.com/landing';
	}
}
function loadClient(callback) {
	//$("#loading").html("Loading Google Drive...");
	gapi.client.load('drive', 'v2', callback);
}
function init() {
	if(document.URL.indexOf("#") !== -1 && document.URL.indexOf("?") === -1){
		if(document.URL.indexOf("state") === -1){
			get_info();
			getContentOfFile(document.URL.split("#")[1]);
			getTitle(document.URL.split("#")[1]);
			setPercent("80");
		}
		else{
			welcome();
			get_info();
			setPercent("65");
		}
	}
	//if neither
	else if(document.URL.indexOf("#") === -1 && document.URL.indexOf("?") === -1){
		welcome();
		get_info();
		setPercent("65");
	}
	//? but not #
	else if(document.URL.indexOf("?") !== -1 && document.URL.indexOf("#") === -1){
		var query = window.location.href.split("?")[1];
		if(query.indexOf("create") !== -1){
			var query_folder_id = query.split("%22")[3];
			insertNewFile(query_folder_id);
		}
		else if(query.indexOf("open") !== -1){
			var query_id = query.split("%22")[3];
			setTimeout(function(){
				if(document.URL.indexOf("mobile") !== -1){
					window.location = "https://codeyourcloud.com/mobile#" + query_id;
				}
				else{
					window.location = "https://codeyourcloud.com#" + query_id;
				}
			}, 1000);
		}
		else{
			welcome();
		}
	}
}
function get_info(){
	ok = true;
    //$("#loading").html("Loading user info...");
    var request = gapi.client.drive.about.get();
    request.execute(function(resp) {
        myRootFolderId = resp.rootFolderId;
        //$("#loading").html("Retrieved root folder...");
        userName = resp.name;
        //$("#loading").html("Got user name");
        $("#user_p").html("welcome, <b>"+userName+"</b>!");
        try{
            userUrl = resp.user.picture.url;
            $("#pic_img").attr("src", userUrl);
            //$("#loading").html("Retrieved profile picture...");
        }
        catch(e){}
        try{
            userId = resp.user.permissionId;
            $("#publish").attr("href", "https://codeyourcloud.com/pub/"+userId+"/index.html");
            //$("#loading").html("Retrieved user id...");
            $("#user_id_p").html("Your user id: <b>" + userId + "</b>");
            user_loaded = true;
            if(sql_loaded){
	            get_sql();
            }
            
        }
        catch(e){}
        TogetherJS.refreshUserData();
        var total_q = resp.quotaBytesTotal;
        //$("#loading").html("Retrieved user quota...");
        var user_q = resp.quotaBytesUsedAggregate;
        //$("#loading").html("Retrieved user usage...");
        var product_q = Math.round(user_q/total_q * 100);
        $("#capacity_used").html(bytesToSize(user_q));
        $("#capacity_total").html(bytesToSize(total_q));
        clock.setTime(product_q);
    });
}
function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Bytes';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};
/**********
CLOCK
***********/
var clock = $('.clock').FlipClock(0, {
	clockFace: 'Counter'
});
clock.stop(function(){});
/*********
SAVE FILE
**********/
function save(){
	if(!isSaving){
		changes_made = false;
		saveNoSend();
		sendSave();
	}
}
function saveNoSend(){
	refreshTodo("");
	if(ok && !isWelcome){
		isSaving = true;
		setState("saving");
		var theID = current;
		saveFile(theID, editor.getValue());
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
/**********
OFFLINE
***********/
var online = true;
function isOnline() {
    
};
/**********
PDF
**********/

function to_pdf(){
    var doc = new jsPDF();
    var s = editor.getValue().split("\n");
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
var lorem_type = "s";
function generate(){
    $("#lorem").html("");
    var lorem = new Lorem;
    lorem.type = Lorem.TEXT;
    lorem.query = $("#num_lorem").val() + lorem_type;
    lorem.createLorem(document.getElementById('lorem'));
}
$('.no_submit').submit(function(e) {
    e.preventDefault();
});
function lorem_s(){
	lorem_type = "s";
	$("#lorem_choose").html('Sentences <span class="caret"></span>');
}
function lorem_w(){
	lorem_type = "w";
	$("#lorem_choose").html('Words <span class="caret"></span>');
}
function lorem_p(){
	lorem_type = "p";
	$("#lorem_choose").html('Paragraphs <span class="caret"></span>');
}
/***********
RUN
***********/
function run(){
	if(editor.getSession().getMode().$id.indexOf("javascript") !== -1 || editor.getSession().getMode().$id.indexOf("js") !== -1){
		var code_before_replace = editor.getValue();
		var find = 'console.log';
		var re = new RegExp(find, 'g');
		code_before_replace = code_before_replace.replace(re, 'printToConsole');
		if(editor.getValue().indexOf("console.log") !== -1 && !console_open){
			openConsole();
		}
		eval(code_before_replace);
	}
}
/**********
AUTOSAVE
**********/
function auto_save_switch(){
	if(auto_save === true){
		auto_save = false;
	}
	else{
		auto_save = true;
	}
}
function auto_save_update(){
	auto_save_int = Number($("#save_int").val()) * 1000;
}