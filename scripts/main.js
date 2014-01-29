var server;
scrollTo(0,0);
//
var CLIENT_ID = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/userinfo.profile'];
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
	if($("#note").html() !== "All Changes Saved To Drive" || $("#note").html() === "Saving..." && doc_url !== "https://codeyourcloud.com/"){
		//it's ok
		if(isWelcome === false && TOpen === true){
			TogetherJS(this);
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
		try{
			myRootFolderId = resp.rootFolderId;
			userName = resp.name;
			$("#user_p").html(userName);
			userUrl = resp.user.picture.url;
			$("#pic_img").attr("src", userUrl);
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
		}
		catch(e){
			console.log("there was an unknown error");
		}
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
	var url = doc_url;
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
				var theID = doc_url.split("#")[1];
				getContentOfFile(theID);
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
	codeMirror.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
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
		codeMirror.setOption("mode", "markdown");
		 
	}
	if(e === "apl"){
		codeMirror.setOption("mode", "text/apl");
	}
	if(e === "asterisk"){
		codeMirror.setOption("mode", "text/x-asterisk");
	}
	if(e === "diff"){
		codeMirror.setOption("mode", "text/x-diff");
	}
	if(e === "haml"){
		codeMirror.setOption("mode", "text/x-haml");
	}
	if(e === "hi" || e === "hs"){
		codeMirror.setOption("mode", "text/x-haskell");
	}
	if(e === "haxe"){
		codeMirror.setOption("mode", "text/x-haxe");
	}
	if(e === "jinja2"){
		codeMirror.setOption("mode", "{name: 'jinja2', htmlMode: true}");
	}
	if(e === "jl"){
		codeMirror.setOption("mode", "text/x-julia");
	}
	if(e === "nginx" || e === "conf"){
		codeMirror.setOption("mode", "text/nginx");
	}
	if(e === "m" || e === "octave"){
		codeMirror.setOption("mode", "text/x-octave");
	}
	if(e === "properties"){
		codeMirror.setOption("mode", "text/x-properties");
	}
	if(e === "q"){
		codeMirror.setOption("mode", "text/x-q");
	}
	if(e === "r"){
		codeMirror.setOption("mode", "text/x-rsrc");
	}
	if(e === "rc"){
		codeMirror.setOption("mode", "text/x-rustsrc");
	}
	if(e === "scm" || e === "ss"){
		codeMirror.setOption("mode", "text/x-scheme");
	}
	if(e === "sieve"){
		codeMirror.setOption("mode", "application/sieve");
	}
	if(e === "xquery"){
		codeMirror.setOption("mode", "application/xquery");
	}
	if(fileValue === "gfm"){
		codeMirror.setOption("mode", "gfm");
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
var numUndo = 0;
var numRedo = 0;
function navUndo() {
	if(numUndo < codeMirror.getDoc().historySize().undo - 1){
		codeMirror.getDoc().undo();
		numUndo++;
	}
}
function navRedo() {
	if(numRedo < codeMirror.getDoc().historySize().redo){
		codeMirror.getDoc().redo();
		numRedo++;
	}
}
function line_numbers() {
	if(codeMirror.getOption("lineNumbers")){
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
	window.location.href = "https://codeyourcloud.com/about#help";
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
			"Ctrl-Space": function(cm) {
				console.log("stuff");
				server.complete(codeMirror); 
			},
			"Ctrl-I": function(cm) { server.showType(cm); },
			"Ctrl-.": function(cm) { server.jumpToDef(cm); },
			"Ctrl-,": function(cm) { server.jumpBack(cm); },
			"Ctrl-Q": function(cm) { server.rename(cm); },
		})
		codeMirror.on("cursorActivity", function(cm) { server.updateArgHints(codeMirror); });
		});
}
function getHint(){
	if(title.indexOf(".js") !== -1){
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
		if(change.text[0] === "/" || change.text[0] === "<"){
			CodeMirror.showHint(codeMirror, CodeMirror.hint.html);	
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
	$("#side").css("z-index", -1);
	sideOpen = true;
	document.getElementById("content").className = document.getElementById("content").className + " shrinkContent";
	setTimeout(function(){
		removeClass("content","shrinkContent");
		document.getElementById("content").style.width = "80%";
		document.getElementById("the-arrow").innerHTML = "<i class='fa fa-caret-square-o-right'></i>";
		$("#side-arrow").attr("onclick","closeSide()");
		//
		//
		$("#side").css("z-index", 0);	
	}, 500);
}
function closeSide(){
	$("#side").css("z-index", -1);
	sideOpen = false;
	//
	//
	document.getElementById("content").className = document.getElementById("content").className + " expandContent";
	setTimeout(function(){
		removeClass("content","expandContent");
		document.getElementById("content").style.width = "100%";
		document.getElementById("the-arrow").innerHTML = "<i class='fa fa-caret-square-o-left'></i>";
		$("#side-arrow").attr("onclick","openSide()");
	}, 500);
}
//on startup
sideOpen = false;
document.getElementById("content").style.width = "100%";
document.getElementById("the-arrow").innerHTML = "<i class='fa fa-caret-square-o-left'></i>";
$("#side-arrow").attr("onclick","openSide()");

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
	if(TOpen === false && doc_url.indexOf("#") !== -1){
		setTimeout(function(){
		TogetherJS(this);
		}, 1000);	
	}
}
function checkData(){
	
}
function pref(){
	$("#prefModal").modal('show');
}
//
//
//
/**********
FONT SIZE
**********/
function fontUp(){
	var old = Number($("#content").css("fontSize").replace("px", ""));
	if(old < 100){
		old = old + 2;
	}
	$("#content").css("fontSize", old+"px");
}
function fontDown(){
	var old = Number($("#content").css("fontSize").replace("px", ""));
	if(old > 4){
		old = old - 2;
	}
	$("#content").css("fontSize", old+"px");
}
