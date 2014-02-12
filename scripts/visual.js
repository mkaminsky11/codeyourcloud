var autoC = true;
var isWelcome = false;
var wasBlank = false;
$("#side").css("z-index", -1);
/*******************
CODEMIRROR/VIM STUFF
*******************/
var delay;
var title = "";
var codeMirror = CodeMirror(document.getElementById("content"), {
    lineNumbers: true,mode: "text",theme: "cobalt", lineWrapping: false, indentUnit: 4, indentWithTabs: true
});
codeMirror.on("change", function(cm, change) {
	setState("unsaved");
	//
	checkUndo();
	clearTimeout(delay);
    	delay = setTimeout(updatePreview, 300);
	if(title.indexOf(".js") !== -1 && change.text === " "){
		server.complete(codeMirror);
	}
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
$("#container").css('backgroundColor', $(".CodeMirror").css('backgroundColor'));
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'flat'
}
function updatePreview() {
       	var previewFrame = document.getElementById('preview');
		var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
		preview.open();
		preview.write(codeMirror.getValue());
		preview.close();
}
setTimeout(updatePreview, 300);
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
	var txtFile = new XMLHttpRequest();
	txtFile.open("GET", "https://codeyourcloud.com/intro.txt", true);
	txtFile.onreadystatechange = function()
	{
		if (txtFile.readyState === 4) {  // document is ready to parse.
			if (txtFile.status === 200) {  // file is found
				allText = txtFile.responseText; 
				codeMirror.setValue(allText);
			}
		}
	}
	txtFile.send(null);
}
/*********
FILE NAME
*********/
function checkFileName(fileValue) { //adjusts the mode based on the file name
	bootHide("autoButton");
    var e = exten(fileValue);
    codeMirror.setOption("mode", "text"); //default
    codeMirror.setOption("extraKeys", {});
    switch(e){
        case "java":
            codeMirror.setOption("mode", "text/x-java");
            break;
        case "py":
            codeMirror.setOption("mode", "text/x-python");
            startPython();
            removeClass("autoButton","hide");
            break;
        case "c":
            codeMirror.setOption("mode", "text/x-csrc");
            break;
        case "css":
            codeMirror.setOption("mode", "text/css");
            startCss();
            removeClass("autoButton","hide");
            break;
        case "html":
            codeMirror.setOption("mode", "text/html");
            startHtml();
            removeClass("autoButton","hide");
	        codeMirror.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
	        break;
        case "js":
            codeMirror.setOption("mode", "text/javascript");
            startTern();
            removeClass("autoButton","hide");
            break;
        case "coffee":
            codeMirror.setOption("mode", "coffeescript");
            break;
        case "pl":
            codeMirror.setOption("mode", "perl");
            break;
        case "php":
            codeMirror.setOption("mode", "php");
            break;
        case "xml":
            codeMirror.setOption("mode", "xml");
            startXml();
            removeClass("autoButton","hide");
            break;
        case "rb":
            codeMirror.setOption("mode", "text/x-ruby");
            break;
        case "ru":
            codeMirror.setOption("mode", "text/x-ruby");
            break;
        case "sql":
            codeMirror.setOption("mode", "sql");
            startSql();
            removeClass("autoButton","hide");
            break;
        case "cpp":
            codeMirror.setOption("mode", "text/x-c++src");
            break;
        case "cs":
             codeMirror.setOption("mode", "text/x-csharp");
             break;
        case "groovy":
            codeMirror.setOption("mode", "text/x-groovy");
            break;
        case "go":
            codeMirror.setOption("mode", "text/x-go");
            break;
        case "cob":
            codeMirror.setOption("mode", "cobol");
            break;
        case "COB":
            codeMirror.setOption("mode", "cobol");
            break;
        case "pas":
            codeMirror.setOption("mode", "text/x-pascal");
            break;
        case "pp":
            codeMirror.setOption("mode", "text/x-pascal");
            break;
        case "less":
            codeMirror.setOption("mode", "text/css");
            break;
        case "lua":
            codeMirror.setOption("mode", "text/x-lua");
            break;
        case "clj":
            codeMirror.setOption("mode", "text/x-clojure");
            break;
        case "jade":
            codeMirror.setOption("mode", "text/x-jade");
            break;
        case "sh":
            codeMirror.setOption("mode", "text/x-sh");
            break;
        case "sass":
            codeMirror.setOption("mode", "text/x-sass");
            break;
        case "d":
            codeMirror.setOption("mode", "text/x-d");
            break;
        case "erl":
            codeMirror.setOption("mode", "text/x-erlang");
            break;
        case "scala":
            codeMirror.setOption("mode", "text/x-scala");
            break;
        case "md":
            codeMirror.setOption("mode", "markdown");
            break;
        case "apl":
            codeMirror.setOption("mode", "text/apl");
            break;
        case "asterisk":
            codeMirror.setOption("mode", "text/x-asterisk");
            break;
        case "diff":
            codeMirror.setOption("mode", "text/x-diff");
            break;
        case "haml":
            codeMirror.setOption("mode", "text/x-haml");
            break;
        case "hi":
            codeMirror.setOption("mode", "text/x-haskell");
            break;
        case "hs":
            codeMirror.setOption("mode", "text/x-haskell");
            break;
        case "haxe":
            codeMirror.setOption("mode", "text/x-haxe");
            break;
        case "jinja2":
            codeMirror.setOption("mode", "{name: 'jinja2', htmlMode: true}");
            break;
        case "jl":
            codeMirror.setOption("mode", "text/x-julia");
            break;
        case "nginx":
            codeMirror.setOption("mode", "text/nginx");
            break;
        case "conf":
            codeMirror.setOption("mode", "text/nginx");
            break;
        case "m":
            codeMirror.setOption("mode", "text/x-octave");
            break;
        case "octave":
            codeMirror.setOption("mode", "text/x-octave");
            break;
        case "properties":
            codeMirror.setOption("mode", "text/x-properties");
            break;
        case "q":
            codeMirror.setOption("mode", "text/x-q");
            break;
        case "r":
            codeMirror.setOption("mode", "text/x-rsrc");
            break;
        case "rc":
            codeMirror.setOption("mode", "text/x-rustsrc");
            break;
        case "scm":
            codeMirror.setOption("mode", "text/x-scheme");
            break;
        case "ss":
            codeMirror.setOption("mode", "text/x-scheme");
            break;
        case "sieve":
            codeMirror.setOption("mode", "application/sieve");
            break;
        case "xquery":
            codeMirror.setOption("mode", "application/xquery");
            break;
        case "gfm":
            codeMirror.setOption("mode", "gfm");
            break;
        case "docx":
            badType();
            break;
        case "xls":
            badType();
            break;
        case "ppt":
            badType();
            break;
        case "pdf":
            badType();
            break;
        case "jpg":
            badType();
            break;
        case "jpeg":
            badType();
            break;
        case "png":
            badType();
            break;
        case "gif":
            badType();
            break;
    }
}
function badType(){
    window.location.href="https://codeyourcloud.com/error/file"
};
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
	$("title").html(title);
	checkFileName(title);
}
function cancelRename() {
    sendMessage("rename canceled", "error");
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
	if(numUndo < codeMirror.getDoc().historySize().undo){
		codeMirror.getDoc().undo();
		numUndo++;
		numRedo--;
	}
	else{
		addClass("undoB", "disabled");
	}
}
function checkUndo(){
	if(numUndo < codeMirror.getDoc().historySize().undo - 1){
		removeClass("undoB", "disabled");	
	}
	else{
		addClass("undoB", "disabled");
	}
	if(numRedo < codeMirror.getDoc().historySize().redo){
		removeClass("redoB", "disabled");
	}
	else{
		addClass("redoB", "disabled");
	}
}
function navRedo() {
	if(numRedo < codeMirror.getDoc().historySize().redo){
		codeMirror.getDoc().redo();
		numRedo++;
		numUndo--;
	}
	else{
		addClass("redoB", "disabled");
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
	setThemeNoSend(theme);
	sendTheme(theme);
}
function setThemeNoSend(theme){
	codeMirror.setOption("theme", theme);
	$("#container").css('backgroundColor', $(".CodeMirror").css('backgroundColor'));
	sendMessage("theme is now: "+codeMirror.getOption("theme"));
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
				server.complete(codeMirror); 
			},
			"Ctrl-I": function(cm) { server.showType(cm); },
			"Ctrl-.": function(cm) { server.jumpToDef(cm); },
			"Ctrl-,": function(cm) { server.jumpBack(cm); },
			"Ctrl-Q": function(cm) { server.rename(cm); }
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
	sideOpen = true;
	$("#side").css("z-index", 0);
	document.getElementById("content").className = document.getElementById("content").className + " shrinkContent";
	setTimeout(function(){
		removeClass("content","shrinkContent");
		document.getElementById("content").style.width = "80%";
		document.getElementById("the-arrow").innerHTML = "<i class='fa fa-caret-square-o-right'></i>";
		$("#side-arrow").attr("onclick","closeSide()");
		//
		//
	}, 500);
}
function closeSide(){
	sideOpen = false;
	document.getElementById("content").className = document.getElementById("content").className + " expandContent";
	setTimeout(function(){
		removeClass("content","expandContent");
		document.getElementById("content").style.width = "100%";
		document.getElementById("the-arrow").innerHTML = "<i class='fa fa-caret-square-o-left'></i>";
		$("#side-arrow").attr("onclick","openSide()");
		$("#side").css("z-index", -1);
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
		$("#"+todoId).remove();
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
function refreshTodo(sort){
	$("#todo_ul").html("");
	$("#search_todo").val(sort);
	var code = codeMirror.getValue();
	var lines = code.split("\n");
	for(var i = 0; i < lines.length; i++){
		var done = false;
		if(lines[i].indexOf("NOTE:") !== -1){
			done = true;
			var token = lines[i].split("NOTE:")[1];
			if(token.indexOf(sort) !== -1){
				createTodo(token, i, 0, "note");
			}
		}
		if(lines[i].indexOf("TODO:") !== -1 && done === false){
			done = true;
			var token = lines[i].split("TODO:")[1];
			if(token.indexOf(sort) !== -1){
				createTodo(token, i, 1, "todo");
			}
		}
		if(lines[i].indexOf("FIXME:") !== -1 && done === false){
			var token = lines[i].split("FIXME:")[1];
			if(token.indexOf(sort) !== -1){
				createTodo(token, i, 2, "fixme");
			}
		}
	}
}
$( "#search_todo" ).keypress(function() {
  refreshTodo($("#search_todo").val());
});
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
	setModeNoSend(mode);
	sendMode(mode);
}
function setModeNoSend(mode){
	checkFileName(mode);
	sendMessage("mode is now: "+ codeMirror.getOption("mode"), "info");
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
	sendMessage(name+" is online", "info");
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
	sendMessage("font size is now "+old+" px", "info");
}
$("#content").css("fontSize", "14px");
function fontDown(){
	var old = Number($("#content").css("fontSize").replace("px", ""));
	if(old > 4){
		old = old - 2;
	}
	$("#content").css("fontSize", old+"px");
	sendMessage("font size is now "+old+" px", "info");
}
/**********
COLOR
*************/
$('#color').colorpicker();
function showColor(){
    $('#color').colorpicker('show');
    $('.colorpicker').css("opacity", 100);
    $('.colorpicker').css('visibility', 'visible');
    //if something is selected, TRY to set the color to it.
    if(codeMirror.getDoc().somethingSelected()){
    	try{
	    	$("#color").colorpicker('setValue', codeMirror.getDoc().getSelection());
	    }
	    catch(e){
	    }
    }
    
}
var before = null;
var after = null;
$('#color').colorpicker().on('changeColor', function(ev){
  //bodyStyle.backgroundColor = ev.color.toHex();
  //if something is selected, change it
  if(codeMirror.getDoc().somethingSelected()){
	  codeMirror.getDoc().replaceSelection(ev.color.toHex());
  }
  else{
	  before = codeMirror.getDoc().getCursor();
	  codeMirror.getDoc().replaceRange(""+ev.color.toHex(), before);
	  after = codeMirror.getDoc().getCursor();
	  codeMirror.getDoc().setSelection(before, after);
  }
  //else, insert it
});
function sendMessage(message, type){
    Messenger().post({message:message,showCloseButton: true, hideAfter: 5, type: type});
}