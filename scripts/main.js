var CLIENT_ID = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/userinfo.profile'];
var userId = null;
var ok = false;
var myRootFolderId = null;
var autoC = true;
var isWelcome = false;
var TOpen = false;
/************
AUTHORIZATION
***********/
//this should refresh the token every 300000 milliseconds = 3000 seconds = 50 minutes 
window.onbeforeunload = function () {
	if($("#note").html() === "Unsaved Changes" || $("#note").html() === "Saving..." && document.URL !== "https://codeyourcloud.com/"){
		//it's ok
		if(isWelcome === false){
			TogetherJS(this);
			return "You Have Unsaved Changes. Are Your Sure You Want To Exit?";
		}
	}
	else{
		TogetherJS(this);
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
		userUrl = resp.user.picture.url;
		document.getElementById("pic_img").src = userUrl;
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
/*******************
CODEMIRROR/VIM STUFF
*******************/
var delay;
var title = "";
var codeMirror = CodeMirror(document.getElementById("content"), {
    lineNumbers: true,mode: "text",theme: "cobalt",lineWrapping: true
});
codeMirror.on("change", function(cm, change) {
	setState("unsaved");
	//
	clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
});
codeMirror.setOption("autoCloseBrackets",true);
codeMirror.setOption("matchBrackets",true);
var notepad = CodeMirror(document.getElementById("pad"), {
    lineNumbers: true, mode: "text",lineWrapping: true
});
notepad.refresh();
notes();
CodeMirror.commands.save = function() {
	//:w -> save
	save();
}
function updatePreview() {
       	var previewFrame = document.getElementById('preview');
		var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
		preview.open();
		preview.write(codeMirror.getValue());
		preview.close();
}
setTimeout(updatePreview, 300);
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
/*********
SAVE FILE
**********/
function save(){
	saveNoSend();
	sendSave();
}
function saveNoSend(){
	refreshTodo();
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
	var url = document.URL;
	if(url.indexOf("#") === -1 && url.indexOf("?") === -1){
		//console.log("default");
		welcome()	
	}
	else{
		if(url.indexOf("#state") === -1){
			if(url.indexOf("#") !== -1 && url.indexOf("?") === -1){
				document.getElementById("will_close").style.visibility="visible";
				//console.log("with hash");
				isWelcome = false;
				var theID = document.URL.split("#")[1];
				getContentOfFile(theID);
				getTitle(theID);
				}
				if(url.indexOf("#") === -1 && url.indexOf("?") !== -1 && url.indexOf("ssh") === -1){
					//console.log("with query");
					if(url.indexOf("action%22:%22open") !== -1){
						var temp1 = document.URL.split("%5B%22")[1];
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
				if(url.indexOf("ssh") !== -1){
					//
				}
		}
		else{
			//console.log("default");
			welcome();
		}
	}
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
	var temp1 = document.URL.split("%22folderId%22:%22")[1];
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
/*************
OPEN THE FILE
*************/
function openFile(theId){
	window.location.assign("https://codeyourcloud.com/#"+theId);
}
function welcome() {
	document.getElementById("will_close").style.visibility = "hidden";
	document.getElementById("note").style.visibility="hidden";
	document.getElementById("headerButton_save_right").style.visibility="hidden";
	document.getElementById("renameInput").style.visibility="hidden";
	document.getElementById("ok_rename").style.visibility="hidden";
	document.getElementById("cancel_rename").style.visibility="hidden";
	isWelcome = true;
	document.getElementById("note").innerHTML = "All Changes Saved To Drive";
	setPercent("100");
	codeMirror.setValue("Welcome to Code Your Cloud!");
}
/**********
SAVE FILE
**********/
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
}
}
/***************
SHARING FILES
***************/
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
/*********
FILE NAME
*********/
function checkFileName(fileValue) { //adjusts the mode based on the file name
	bootHide("autoButton");
    var e = exten(fileValue);
    if (e === "java") {
        codeMirror.setOption("mode", "text/x-java");
    }
    if (e === "py") {
        codeMirror.setOption("mode", "text/x-python");
        startPython();
        removeClass("autoButton","hide");
    }
    else{
	   codeMirror.setOption("extraKeys", {}); 
    }
    if (e === "c") {
        codeMirror.setOption("mode", "text/x-csrc");
         
    }
    if (e === "css") {
        codeMirror.setOption("mode", "text/css");
        startCss();
        removeClass("autoButton","hide");
    }
    else{
	     codeMirror.setOption("extraKeys", {});
    }
    if (e === "html") {
        codeMirror.setOption("mode", "text/html");
        startHtml();
        removeClass("autoButton","hide");
    }
    else{
	    codeMirror.setOption("extraKeys", {});
    }
    if (e === "js") {
        codeMirror.setOption("mode", "text/javascript");
        startTern();
        removeClass("autoButton","hide");
    }
    if (e === "coffee") {
        codeMirror.setOption("mode", "coffeescript");
         
    }
    if (e === "pl") {
        codeMirror.setOption("mode", "perl");
         
    }
    if (e === "php") {
        codeMirror.setOption("mode", "php");
         
    }
    if (e === "xml") {
        codeMirror.setOption("mode", "xml");
        startXml();
        removeClass("autoButton","hide");
    }
    if (e === "rb" || e === "ru") {
        codeMirror.setOption("mode", "ruby");
         
    }
    if (e === "sql") {
        codeMirror.setOption("mode", "sql");
        startSql();
        removeClass("autoButton","hide");
    }
    else{
	    codeMirror.setOption("extraKeys", {});
    }
    if( e === "cpp"){
        codeMirror.setOption("mode", "text/x-c++src");
         
    }
    if( e === "cs"){
        codeMirror.setOption("mode", "text/x-csharp");
         
    }
    if( e === "groovy"){
    	codeMirror.setOption("mode", "text/x-groovy");
    	 
    }
    if( e === "go"){
    	codeMirror.setOption("mode", "text/x-go");
    	 
    }
    if( e === "COB" || e === "cob"){
    	codeMirror.setOption("mode", "cobol");
    	 	
    }
    if( e === "pas" || e === "pp"){
    	codeMirror.setOption("mode", "text/x-pascal");
    	 	
    }
    if( e === "rb" || e === "ru"){
	codeMirror.setOption("mode", "text/x-ruby");
	 
    }
    if( e === "less"){
	    codeMirror.setOption("mode", "text/css");
	     
    }
    if( e === "lua"){
	    codeMirror.setOption("mode", "text/x-lua");
	     
    }
	if(e === 'clj'){
		codeMirror.setOption("mode", "text/x-clojure");
		 
	}
	if(e === 'sh'){
		codeMirror.setOption("mode", "text/x-sh");
		 
	}
	if(e === 'jade'){
		codeMirror.setOption("mode", "text/x-jade");
		 
	}
	if(e === 'sass'){
		codeMirror.setOption("mode", "text/x-sass");
		 
	}
	if(e === 'd'){
		codeMirror.setOption("mode", "text/x-d");
		 
	}
	if(e === 'erl'){
		codeMirror.setOption("mode", "text/x-erlang");
		 
	}
	if(e === 'scala'){
		codeMirror.setOption("mode", "text/x-scala");
		 
	}
	if(e === 'markdown' || e === 'mdown' || e === 'mkdn' || e === 'md' || e === 'mdk' || e=== 'mdwn' || e==='mdtext'){
		codeMirror.setOptino("mode", "markdown");
		 
	}
	/*
			<script src = '/code/modes/apl.js'></script>
		<script src = '/code/modes/asterisk.js'></script>
		<script src = '/code/modes/diff.js'></script>
		<script src = '/code/modes/haml.js'></script>
		<script src = '/code/modes/haskell.js'></script>
		<script src = '/code/modes/haxe.js'></script>
		<script src = '/code/modes/jinja2.js'></script>
		<script src = '/code/modes/julia.js'></script>
		<script src = '/code/modes/nginx.js'></script>
		<script src = '/code/modes/octave.js'></script>
		<script src = '/code/modes/properties.js'></script>
		<script src = '/code/modes/q.js'></script>
		<script src = '/code/modes/r.js'></script>
		<script src = '/code/modes/rust.js'></script>
		<script src = '/code/modes/scheme.js'></script>
		<script src = '/code/modes/sieve.js'></script>
		<script src = '/code/modes/xquery.js'></script>
	*/
	if(e === "apl"){
		codeMirror.setOptino("mode", "text/apl");
	}
	if(e === "asterisk"){
		codeMirror.setOptino("mode", "text/x-asterisk");
	}
	if(e === "diff"){
		codeMirror.setOptino("mode", "text/x-diff");
	}
	if(e === "haml"){
		codeMirror.setOptino("mode", "text/x-haml");
	}
	if(e === "hi" || e === "hs"){
		codeMirror.setOptino("mode", "text/x-haskell");
	}
	if(e === "haxe"){
		codeMirror.setOptino("mode", "text/x-haxe");
	}
	if(e === "jinja2"){
		codeMirror.setOptino("mode", "{name: 'jinja2', htmlMode: true}");
	}
	if(e === "jl"){
		codeMirror.setOptino("mode", "text/x-julia");
	}
	if(e === "nginx" || e === "conf"){
		codeMirror.setOptino("mode", "text/nginx");
	}
	if(e === "m" || e === "octave"){
		codeMirror.setOptino("mode", "text/x-octave");
	}
	if(e === "properties"){
		codeMirror.setOptino("mode", "text/x-properties");
	}
	if(e === "q"){
		codeMirror.setOptino("mode", "text/x-q");
	}
	if(e === "r"){
		codeMirror.setOptino("mode", "text/x-rsrc");
	}
	if(e === "rc"){
		codeMirror.setOptino("mode", "text/x-rustsrc");
	}
	if(e === "scm" || e === "ss"){
		codeMirror.setOptino("mode", "text/x-scheme");
	}
	if(e === "sieve"){
		codeMirror.setOptino("mode", "application/sieve");
	}
	if(e === "xquery"){
		codeMirror.setOptino("mode", "application/xquery");
	}
}
function exten(string){
    var ret = "none"; 
    if(string.indexOf(".") !== -1){
        var sp = string.split(".");
        ret = sp[sp.length-1];
    }
    return ret;
}
/***********
RENAME
***********/
function renameFile(fileId, newTitle) {
  var body = {'title': newTitle};
  var request = gapi.client.drive.files.patch({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) {
    console.log('New Title: ' + resp.title);
  });
}
function okRename() {
	okRenameNoSend();
	sendRename();
	return false;
}
function okRenameNoSend(){
	document.getElementById("renameInput").style.borderColor="green";
	setTimeout(function() {
		document.getElementById("renameInput").style.borderColor="white";
	}, 300);
	renameFile(current, document.getElementById('renameInput').value);
	title = document.getElementById('renameInput').value;
	checkFileName(title);
	return false;
}
function cancelRename() {
	document.getElementById("renameInput").style.borderColor = "red";
	setTimeout(function(){
		document.getElementById("renameInput").style.borderColor = "white";
	},300);
	document.getElementById('renameInput').value = title;
	return false;
}
/****************
MENU-SPECIFIC
****************/
function navUndo() {
	codeMirror.getDoc().undo();
}
function navRedo() {
	codeMirror.getDoc().redo();
}
function line_numbers() {
	if(codeMirror.getOption("lineNumbers")){
		//cm.getOption("indentUnit")//
		codeMirror.setOption("lineNumbers",false);
	}
	else{
		codeMirror.setOption("lineNumbers",true);
	}
}
function line_wrap() {
	if(codeMirror.getOption("lineWrapping")){
		codeMirror.setOption("lineWrapping",false);
	}	
	else{
		codeMirror.setOption("lineWrapping",true);
	}
}
function setTheme(theme){
	codeMirror.setOption("theme", theme);
	sendTheme(theme);
}
function setThemeNoSend(theme){
	codeMirror.setOption("theme", theme);
}
function vimBind() {
	if(codeMirror.getOption("keyMap") === "vim"){
		codeMirror.setOption("keyMap","default");
	}
	else if(codeMirror.getOption("keyMap") === "default"){
		codeMirror.setOption("keyMap", "vim");
	}
}
//vim
if(codeMirror.getOption("keyMap") === "vim"){
	$("#vim_bind_switch").prop('checked', true);
}
else {
	$("#vim_bind_switch").prop('checked', false);
}
$('#vim_bind_switch').button( "refresh" );
//num
if(codeMirror.getOption("lineNumbers")){
	$("#lin_num_switch").prop('checked', true);
}
else{
	$("#line_num_switch").prop('checked', false);
}
$('#line_num_switch').button( "refresh" );
//wrap
if(codeMirror.getOption("lineWrapping")){
	$("#line_wrap_switch").prop('checked', true);
}	
else{
	$("#line_wrap_switch").prop('checked', false);	
}
$('#line_wrap_switch').button( "refresh" );
/**************
LINKS TO OTHER
*************/
function navFaq() {
	window.location.href = "https://codeyourcloud.com/about#faq";
	//$('#faqModal').modal('show');
}
function navContactUs() {
	window.location.href = "https://codeyourcloud.com/about#contact"
	//$('#contactModal').modal('show');
}
function signout() {
	window.location.href = "https://accounts.google.com/logout";
}
function FIND(){
	CodeMirror.commands["findNext"](codeMirror);
}
function REPLACE(){
	CodeMirror.commands["replace"](codeMirror)
}
function setState(state){
	if(state === "saved"){
		document.getElementById("note").innerHTML = "All Changes Saved To Drive";
		document.getElementById("note").style.color = "green";
	}
	if(state === "saving"){
		document.getElementById("note").innerHTML = "Saving...";
		document.getElementById("note").style.color = "gray";
	}
	if(state === "unsaved"){
		document.getElementById("note").innerHTML = "Unsaved Changes";
		document.getElementById("note").style.color = "red";
	}
}
/************
BOOTSTRAP
***********/
function initBoot(){

}
function setPercent(per){
	document.getElementById("desc").innerHTML = per + "% complete";
	document.getElementById("prog").style.width = per + "%";
	document.getElementById("prog").ariaValuenow = per + "";		
	if(per === "100"){
		$('#myModal').modal('hide');
	}
	if(per === "0"){
		$('#myModal').modal('show');
	}
}
function showColor() {
	$('#colorpicker').colorpicker('show');
}
$('#colorpicker').colorpicker().on('changeColor', function(ev){
	  //bodyStyle.backgroundColor = ev.color.toHex();
	if(codeMirror.getDoc().somethingSelected()){
		codeMirror.replaceSelection(ev.color.toHex());
	}
	else{
		var before = codeMirror.getDoc().getCursor();
		codeMirror.getDoc().replaceRange(ev.color.toHex(), before);
		var after = codeMirror.getDoc().getCursor();
		codeMirror.getDoc().setSelection(before,after);
	}
});
var server;
function getURL(url, c) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;
      if (xhr.status < 400) return c(null, xhr.responseText);
      var e = new Error(xhr.responseText || "No response");
      e.status = xhr.status;
      c(e);
    };
}
function startTern(){
	getURL("https://codeyourcloud.com/lib/auto/ecma5.json", function(err, code) {
		if (err) throw new Error("Request for ecma5.json: " + err);
		server = new CodeMirror.TernServer({defs: [JSON.parse(code)]});
		codeMirror.setOption("extraKeys", {
			"Ctrl-Space": function(cm) { server.complete(cm); },
			"Ctrl-I": function(cm) { server.showType(cm); },
			"Alt-.": function(cm) { server.jumpToDef(cm); },
			"Alt-,": function(cm) { server.jumpBack(cm); },
			"Ctrl-Q": function(cm) { server.rename(cm); },
			})
			codeMirror.on("cursorActivity", function(cm) { server.updateArgHints(cm); });
			});
}
function getHint(){
	if(title.indexOf(".js") !== -1){
		server.complete(codeMirror);
	}
	if(title.indexOf(".css") !== -1){
		CodeMirror.showHint(codeMirror, CodeMirror.hint.css);
	}
	if(title.indexOf(".xml") !== -1){
		CodeMirror.showHint(codeMirror, CodeMirror.hint.xml, {schemaInfo: tags});
	}
	if(title.indexOf(".html") !== -1){
		CodeMirror.showHint(codeMirror, CodeMirror.hint.html);
	}
	if(title.indexOf(".py") !== -1){
		CodeMirror.showHint(codeMirror, CodeMirror.hint.python);
	}
	if(title.indexOf(".sql") !== -1){
		CodeMirror.showHint(codeMirror, CodeMirror.hint.sql);
	}
}
var dummy = null;
var tags = null;

function startXml(){
	dummy = {
        attrs: {
          color: ["red", "green", "blue", "purple", "white", "black", "yellow"],
          size: ["large", "medium", "small"],
          description: null
        },
        children: []
      };
	  tags = {
        "!top": ["top"],
        top: {
          attrs: {
            lang: ["en", "de", "fr", "nl"],
            freeform: null
          },
          children: ["animal", "plant"]
        },
        animal: {
          attrs: {
            name: null,
            isduck: ["yes", "no"]
          },
          children: ["wings", "feet", "body", "head", "tail"]
        },
        plant: {
          attrs: {name: null},
          children: ["leaves", "stem", "flowers"]
        },
        wings: dummy, feet: dummy, body: dummy, head: dummy, tail: dummy,
        leaves: dummy, stem: dummy, flowers: dummy
      };
      function completeAfter(cm, pred) {
        var cur = cm.getCursor();
        if (!pred || pred()) setTimeout(function() {
          if (!cm.state.completionActive)
            CodeMirror.showHint(cm, CodeMirror.hint.xml, {schemaInfo: tags, completeSingle: false});
        }, 100);
        return CodeMirror.Pass;
      }

      function completeIfAfterLt(cm) {
        return completeAfter(cm, function() {
          var cur = cm.getCursor();
          return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "<";
        });
      }

      function completeIfInTag(cm) {
        return completeAfter(cm, function() {
          var tok = cm.getTokenAt(cm.getCursor());
          if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
          var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
          return inner.tagName;
        });
      }
      codeMirror.setOption("extraKeys", {
          "'<'": completeAfter,
          "'/'": completeIfAfterLt,
          "' '": completeIfInTag,
          "'='": completeIfInTag,
          "Ctrl-Space": function(cm) {
            CodeMirror.showHint(cm, CodeMirror.hint.xml, {schemaInfo: tags});
          }
        });
}
function startHtml(){
	codeMirror.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
	codeMirror.on("inputRead", function(cm, change){
		if(change.text[0] === "/"){
			CodeMirror.showHint(cm, CodeMirror.hint.html);	
		}
	});
}
function startCss(){
	codeMirror.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
function startSql(){
	codeMirror.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
function startPython(){
	codeMirror.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
/*********
SIDEBAR
********/
var sideOpen = false;
var sideView = 1; //1 = notes 2 = docs 3 = todo;
function openSide(){
	sideOpen = true;
	removeClass("side","hide");
	document.getElementById("side").className = document.getElementById("side").className + " expandSide";
	document.getElementById("content").className = document.getElementById("content").className + " shrinkContent";
	setTimeout(function(){
		removeClass("side","expandSide");
		removeClass("content","shrinkContent");
		document.getElementById("content").style.width = "80%";
		document.getElementById("side").style.width = "20%";
		document.getElementById("the-arrow").innerHTML = "<i class='fa fa-caret-square-o-right'></i>";
		$("#side-arrow").attr("onclick","closeSide()");
		//
		removeClass("theTabs","hide");
		if(sideView === 1){
			removeClass("pad","hide");
		}
		if(sideView === 2){
			removeClass("docs","hide");
		}
		if(sideView === 3){
			removeClass("todo", "hide");
		}
		if(sideView === 4){
			removeClass("brow", "hide");
		}
		bootHide("placeholder");
		//
	}, 500);
}
function closeSide(){
	sideOpen = false;
	//
	bootHide("theTabs");
	bootHide("pad");
	bootHide("todo");
	bootHide("docs");
	bootHide("brow");
	removeClass("placeholder", "hide");
	//
	document.getElementById("side").className = document.getElementById("side").className + " shrinkSide";
	document.getElementById("content").className = document.getElementById("content").className + " expandContent";
	setTimeout(function(){
		removeClass("content","expandContent");
		removeClass("side","shrinkSide");
		document.getElementById("content").style.width = "100%";
		document.getElementById("side").style.width = "0%";
		bootHide("side");
		document.getElementById("the-arrow").innerHTML = "<i class='fa fa-caret-square-o-left'></i>";
		$("#side-arrow").attr("onclick","openSide()");
	}, 500);
}
function bootHide(id){
	document.getElementById(id).className = document.getElementById(id).className + " hide";
}
function notes(){
	sideView = 1;
	removeClass("pad", "hide");
	bootHide("todo");
	bootHide("docs");
	bootHide("brow");
	notepad.refresh();
}
function docs(){
	sideView = 2;
	removeClass("docs", "hide");
	bootHide("pad");
	bootHide("todo");
	bootHide("brow");
}
function todo(){
	sideView = 3;
	removeClass("todo", "hide");
	bootHide("docs");
	bootHide("pad");
	bootHide("brow");
}
function brow(){
	sideView = 4;
	removeClass("brow", "hide");
	bootHide("docs");
	bootHide("pad");
	bootHide("todo");
}
function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
function contentSize(wid){
	document.getElementById("content").style.width = wid+"%";
	document.getElementById("side").style.width = (100-wid)+"%";
}
function removeTodo(todoId){
	var s = todoId.split("-");
	var line = parseInt(s[1]);
	var lines=codeMirror.getValue().split("\n");
	if(s[0] === "todo"){
		var start = new Object();
		var ending = new Object();
		start.line = line;
		ending.line = line;
		start.ch = lines[line].indexOf("TODO:");
		ending.ch = (""+lines[line]).length;
		codeMirror.replaceRange("",start,ending);
	}
	if(s[0] === "fixme"){
		var start = new Object();
		var ending = new Object();
		start.line = line;
		ending.line = line;
		start.ch = lines[line].indexOf("FIXME:");
		ending.ch = (""+lines[line]).length;
		codeMirror.replaceRange("",start,ending);
	}
	if(s[0] === "note"){
		var start = new Object();
		var ending = new Object();
		start.line = line;
		ending.line = line;
		start.ch = lines[line].indexOf("NOTE:");
		ending.ch = (""+lines[line]).length;
		codeMirror.replaceRange("",start,ending);
	}
	document.getElementById(todoId).className = document.getElementById(todoId).className + " removeTodo";
	setTimeout(function(){
		removeClass(todoId, "removeTodo");
		document.getElementById(todoId).remove();
	}, 500);
}
function createTodo(note, line, character, kind){
	var temp = "";
	if(note.length > 15){
		for(var i = 0; i < 15; i++){
			temp = temp + note.charAt(i);
		}
		temp = temp + "..."
	}
	else{
		temp = note;
	}
	todoId = kind + "-" + line + "-" + character;
	//var todoButton = "<span><button class='btn btn-default' onclick='removeTodo(\"" + todoId + "\")'><i class='fa fa-check-square-o'></i></button></
	var div1 = "";
	if(kind === "note"){
		div1 = "<div class='todo-icon fui-check'></div>";
	}
	if(kind === "todo"){
		div1 = "<div class='todo-icon fui-plus'></div>";
	}
	if(kind === "fixme"){
		div1 = "<div class='todo-icon fui-cross'></div>";
	}
	var div2 = "<div class='todo-content'><h4 class='todo-name'>"+note+"</h4>:"+line+"</div>";
	var fin = "<li id='"+todoId+"' onclick='removeTodo(\"" + todoId + "\")'>"+div1+div2+"</li>";
	//console.log(fin);
	try{
	document.getElementById("todo_ul").innerHTML = document.getElementById("todo_ul").innerHTML+fin;
	}
	catch(e){}
}
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
function refreshTodo(){
	document.getElementById("todo").innerHTML = "<ul id='todo_ul'></ul>";
	var code = codeMirror.getValue();
	var lines = code.split("\n");
	for(var i = 0; i < lines.length; i++){
		var done = false;
		if(lines[i].indexOf("NOTE:") !== -1){
			done = true;
			var token = lines[i].split("NOTE:")[1];
			createTodo(token, i, 0, "note");
		}
		if(lines[i].indexOf("TODO:") !== -1 && done === false){
			done = true;
			var token = lines[i].split("TODO:")[1];
			createTodo(token, i, 1, "todo");
		}
		if(lines[i].indexOf("FIXME:") !== -1 && done === false){
			var token = lines[i].split("FIXME:")[1];
			createTodo(token, i, 2, "fixme");
		}
	}
}
function removeClass(id, classToRemove){
	var e = document.getElementById(id);
	var classes = ""+e.className;
	var s = classes.split(classToRemove);
	var fin = s.join("");
	e.className = fin;
}
bootHide("side");
function show_terminal(){
	if(sideOpen === false){
		openSide();
	}
	if(sideView !== 2){
		docs();
	}
}
function show_todo(){
	if(sideOpen === false){
		openSide();
	}	
	if(sideView !== 3){
		todo();
	}
}
function show_notepad(){
	if(sideOpen === false){
		openSide();
	}
	if(sideView !== 1){
		notes();
	}
}
function setMode(mode){
	checkFileName(mode);
	sendMode(mode);
}
function setModeNoSend(mode){
	checkFileName(mode);
}
$('[data-toggle="tooltip"]').tooltip({
    'placement': 'left'
});
/************
CHECK IF NO DUPLICATES
**************/
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
TogetherJSConfig_on_ready = function () {
  TOpen = true;
};
TogetherJSConfig_on_close = function () {
  TOpen = false;
};
/***************
USERS ARE ONLINE
****************/
function addClass(id, className){
	document.getElementById(id).className =document.getElementById(id).className + " "+className;
}
function notify(name){
	if(TOpen === false && document.URL.indexOf("#") !== -1){
		setTimeout(function(){
		TogetherJS(this);
		}, 1000);	
	}
}
function checkData(){
	//if line numbers
	
	//if line wrap
	
	//if vim
}
function pref(){
	$("#prefModal").modal('show');
}
