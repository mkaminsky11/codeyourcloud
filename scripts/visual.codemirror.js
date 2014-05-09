var isWelcome = false; //welcome screen
$("#side").css("z-index", -1);
$("#container").css('backgroundColor', $(".CodeMirror").css('backgroundColor'));
$(".run-button").addClass('hide');
$(".html-button").addClass('hide');
/*******************
CODEMIRROR
*******************/
var delay;
var title = "";
var editor = CodeMirror(document.getElementById("content"), {
    lineNumbers: true,
    mode: "text",
    theme: "monokai", 
    lineWrapping: false, 
    indentUnit: 4, 
    indentWithTabs: true
});
editor.on("change", function(cm, change) {
	setState("unsaved");
	checkUndo(); //can you undo?
	clearTimeout(delay);
    delay = setTimeout(updatePreview, 300);
    changes_made = true;
});
editor.on("cursorActivity", function(cm, change) {
var display = editor.getDoc().getCursor().ch + "|" + editor.getDoc().getCursor().line; 
$("#indicator").html(display);
});
editor.setOption("autoCloseBrackets",true);
editor.setOption("matchBrackets",true);

CodeMirror.commands.save = function() {
	//:w -> save
	save();
}
/************
MESSENGER
************/
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'flat'
}
function sendMessage(message, type){
    Messenger().post({message:message,showCloseButton: true, hideAfter: 5, type: type});
}
/***********
PREVIEW
***********/
function updatePreview() {
       	var previewFrame = document.getElementById('preview');
		var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
		preview.open();
		preview.write(editor.getValue());
		preview.close();
}
/*************
OPEN THE FILE
*************/
function welcome() {
	ok = true;
	$("#col_li").remove();
	
	$(".run-button").addClass("hide");
	$(".html-button").addClass("hide");	
	$("#console_toggle").addClass("hide");
	document.getElementById("will_close").style.visibility = "hidden";
	document.getElementById("note").style.visibility="hidden";
	addClass("headerButton_save_right", "disabled");
	$("#renameInput").attr("disabled", "disabled");
	addClass("ok_rename", "disabled");
	addClass("cancel_rename", "disabled");
	
	$("#save_li").remove();
	$("#share_li").remove();
	isWelcome = true;
    document.getElementById("note").innerHTML = "All Changes Saved To Drive";
    setPercent("90");
	setPercent("100");
	var txtFile = new XMLHttpRequest();
	txtFile.open("GET", "https://codeyourcloud.com/intro.txt", true);
	txtFile.onreadystatechange = function()
	{
		if (txtFile.readyState === 4) {  // document is ready to parse.
			if (txtFile.status === 200) {  // file is found
				allText = txtFile.responseText; 
				editor.setValue(allText);
			}
		}
	}
	txtFile.send(null);
}
/*********
MODES
*********/
var ex = ["java","py","c|h|m","css","html","js","coffee","pl","php","xml","rb|ru","sql","cpp","cs","groovy","go","col|COB","pas|pp","less","lua","clj","jade","sh","scss","d","erl","scala","md","apl","asterisk","diff","haml","hi|hs","haxe","jinja2","jl","nginx|conf","octave|mat|matlab","properties","q","r","rc","scm|ss","sieve","xq","gfm","lisp","dtd","e","mrc","tcl","text"];

var names = ["Java", "Python", "C", "CSS", "HTML", "Javascript", "Coffeescript", "Perl", "Php", "xml", "Ruby", "sql", "C++", "C#", "Groovy", "GO", "cobol", "Pascal", "Less", "Lua", "Clojure", "Jade", "Shell", "Sass", "D", "Erlang", "Scala", "markdown", "apl", "Asterisk", "Diff", "Haml", "Haskell", "Haxe", "jinja2", "julia", "nginx", "Octave", "Properties", "Q", "R", "Rust", "Scheme", "Sieve", "Xquery", "Github markdown", "Common lisp", "dtd", "Eiffel", "mirc", "tcl", "Latex"];

var modes = ["text/x-java", "text/x-python", "text/x-csrc", "text/css", "text/html", "text/javascript", "coffeescript", "perl", "php", "xml", "text/x-ruby", "sql", "text/x-c++src", "text/x-csharp", "text/x-groovy", "text/x-go", "cobol", "text/x-pascal", "text/css", "text/x-lua", "text/x-clojure", "text/x-jade", "text/x-sh", "text/x-sass", "text/x-d", "text/x-erlang", "text/x-scala", "markdown", "text/apl", "text/x-asterisk", "text/x-diff", "text/x-haml", "text/x-haskell", "text/x-haxe", "{name: 'jinja2', htmlMode: true}", "text/x-julia", "text/nginx", "text/x-octave", "text/x-properties", "text/x-q", "text/x-rsrc", "text/x-rustsrc", "text/x-scheme", "application/sieve", "application/xquery", "gfm", "text/x-common-lisp", "application/xml-dtd", "text/x-eiffel", "text/mirc", "text/x-tcl", "text/x-stex"];

for(var i = 0; i < ex.length; i++){
	var use_exten = "."+ex[i].split("|")[0];
	var new_html = "<li class=\"list-group-item\" onclick=\"checkFileName('"+ use_exten +"')\">" + names[i] + "</li>";
	$(".mode_ul").html($(".mode_ul").html() + new_html);
}


function checkFileName(fileName){
	$("#autoButton").addClass("hide");
    var e = exten(fileName);
    console.log(e);
    editor.setOption("mode", "text"); //default
    editor.setOption("extraKeys", {});
    $(".run-button").addClass("hide");
    $(".html-button").addClass("hide");
    var found = false;
	for(var i = 0; i < ex.length; i++){
		var possible = ex[i].split("|");
		for(var a = 0; a < possible.length; a++){
			if(possible[a] === e){
				found = true;
				editor.setOption("mode", modes[i]);
			}
		}
	}
	if(e.indexOf("html") !== -1){
	    startHtml();
        $("#autoButton").removeClass("hide");
        $(".html-button").removeClass("hide");
		editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
	}
	if(e.indexOf("js") !== -1){
        $("#autoButton").removeClass("hide");
        $(".run-button").removeClass("hide");
	}
	if(e.indexOf("py") !== -1){
        startPython();
        $("#autoButton").removeClass("hide");
	}
	if(e.indexOf("xml") !== -1){
		startXml();
        $("autoButton").removeClass("hide");
	}
	if(e.indexOf("css") !== -1){
        startCss();
        $("#autoButton").removeClass("hide");	
	}
}
function badType(){
    window.location="https://codeyourcloud.com/error/file";
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
UNDO/REDO
****************/
var numUndo = 0;
var numRedo = 0;
function navUndo() {
	if(numUndo < editor.getDoc().historySize().undo){
		editor.getDoc().undo();
		numUndo++;
		numRedo--;
	}
	else{
		$("#undoB").addClass("disabled");
	}
}
function checkUndo(){
	if(numUndo < editor.getDoc().historySize().undo - 1){
		$("#undoB").removeClass("disabled");
	}
	else{
		$("#undoB").addClass("disabled");
	}
	if(numRedo < editor.getDoc().historySize().redo){
		$("#redoB").removeClass("disabled");
	}
	else{
		$("#redoB").addClass("disabled");
	}
}
function navRedo() {
	if(numRedo < editor.getDoc().historySize().redo){
		editor.getDoc().redo();
		numRedo++;
		numUndo--;
	}
	else{
		$("#redoB").addClass("disabled");
	}
}
/************
PREFERENCES
************/
function line_numbers() {
	if(line_number){
		editor.setOption("lineNumbers",false);
		line_number = false;
	}
	else{
		editor.setOption("lineNumbers",true);
		line_number = true;
	}
	set_sql();
}
function line_wrap() {
	if(editor.getOption("lineWrapping")){
		editor.setOption("lineWrapping",false);
		line_wrap = false;
	}	
	else{
		editor.setOption("lineWrapping",true);
		line_wrap = true;
	}
}

function auto_bind(){
	if(autoC === true){
		autoC = false;
	}
	else{
		autoC = true;
	}
	set_sql();
}
function setTheme(theme){
	editor.setOption("theme", theme);
	$("#container").css('backgroundColor', $(".CodeMirror").css('backgroundColor'));
}
/**************
LINKS TO OTHER
*************/
function navFaq() {
	window.location = "https://codeyourcloud.com/about#help";
}
function navContactUs() {
	window.location = "https://codeyourcloud.com/about#contact"
}
function signout() {
	window.location = "https://accounts.google.com/logout";
}
/**************
FIND/REPLACE
**************/
function FIND(){
	CodeMirror.commands["findNext"](editor);
}
function REPLACE(){
	CodeMirror.commands["replace"](editor)
}
/****************
SAVE STATE
****************/
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
	if(per === "100"){
		setTimeout(function(){
			$("#screen").animate({
				marginTop: "-100%",
				marginBottom: "100%"
			},750,function(){
				//$("#pre").remove();
				$("#screen").remove();
			});
		}, 1000);
	}
}
/*************
TERN
*************/
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
		editor.setOption("extraKeys", {
			"Ctrl-Space": function(cm) {
				server.complete(editor); 
			},
			"Ctrl-I": function(cm) { server.showType(cm); },
			"Ctrl-.": function(cm) { server.jumpToDef(cm); },
			"Ctrl-,": function(cm) { server.jumpBack(cm); },
			"Ctrl-Q": function(cm) { server.rename(cm); }
		})
		editor.on("cursorActivity", function(cm) { server.updateArgHints(editor); });
		});
}
/*****
SHOW HINT
**********/
function getHint(){
	yes_context = false;
	if(editor.getOption("mode").indexOf("javascript") !== -1){
	}
	if(editor.getOption("mode").indexOf("css") !== -1){
		CodeMirror.showHint(editor, CodeMirror.hint.css);
	}
	if(editor.getOption("mode").indexOf("xml") !== -1){
		CodeMirror.showHint(editor, CodeMirror.hint.xml, {schemaInfo: tags});
	}
	if(editor.getOption("mode").indexOf("html") !== -1){
		CodeMirror.showHint(editor, CodeMirror.hint.html);
	}
	if(editor.getOption("mode").indexOf("py") !== -1){
		CodeMirror.showHint(editor, CodeMirror.hint.python);
	}
	if(editor.getOption("mode").indexOf("sql") !== -1){
		CodeMirror.showHint(editor, CodeMirror.hint.sql);
	}
}
function bootHide(id){
	$("#"+id).addClass("hide");
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
      editor.setOption("extraKeys", {
          "'<'": completeAfter,
          "'/'": completeIfAfterLt,
          "' '": completeIfInTag,
          "'='": completeIfInTag,
          "Ctrl-Space": function(cm) {
            CodeMirror.showHint(cm, CodeMirror.hint.xml, {schemaInfo: tags});
          }
        });
}
/**********
HTML
**********/
function startHtml(){
	editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
	editor.on("inputRead", function(cm, change){
		if(change.text[0] === "/" || change.text[0] === "<"){
			CodeMirror.showHint(editor, CodeMirror.hint.html);	
		}
	});
}
/********
CSS
********/
function startCss(){
	editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
/*******
SQL
*******/
function startSql(){
	editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
/********
PYTHON
********/
function startPython(){
	editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
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
/**********
FONT SIZE
**********/
function fontUp(){
	var old = Number($("#content").css("fontSize").replace("px", ""));
	if(old < 100){
		old = old + 2;
	}
	$("#content").css("fontSize", old+"px");
	$("#spinner-font").val(old);
	sql_font = old;
	set_sql();
}
$("#content").css("fontSize", "12px");
function fontDown(){
	var old = Number($("#content").css("fontSize").replace("px", ""));
	if(old > 4){
		old = old - 2;
	}
	$("#content").css("fontSize", old+"px");
	$("#spinner-font").val(old);
	sql_font = old;
	set_sql();
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
    if(editor.getDoc().somethingSelected()){
    	try{
	    	$("#color").colorpicker('setValue', editor.getDoc().getSelection());
	    }
	    catch(e){
	    }
    }
    
}
var before = null;
var after = null;
$('#color').colorpicker().on('changeColor', function(ev){
  if(editor.getDoc().somethingSelected()){
	  editor.getDoc().replaceSelection(ev.color.toHex());
  }
  else{
	  before = editor.getDoc().getCursor();
	  editor.getDoc().replaceRange(""+ev.color.toHex(), before);
	  after = editor.getDoc().getCursor();
	  editor.getDoc().setSelection(before, after);
  }
});

$('#nav_color').colorpicker();
function showNavColor(){
    $('#nav_color').colorpicker('show');
    $('.colorpicker').css("opacity", 100);
    $('.colorpicker').css('visibility', 'visible');
    //if something is selected, TRY to set the color to it.
    try{
	    $("#color").colorpicker('setValue', editor.getDoc().getSelection());
	    $("#nav_color").colorpicker('setValue', $(".navbar-inverse").css("background-color"));
	}
	catch(e){
	}    
}
$('#nav_color').colorpicker().on('changeColor', function(ev){
    editor.getDoc().replaceSelection(ev.color.toHex());
    $(".navbar-inverse").css("background-color", ev.color.toHex());
});
/************
MOVE RIGHT/LEFT
************/
function moveLeft(){
    if(editor.getDoc().somethingSelected()){
        var old_value = editor.getDoc().getSelection().split("\n");
        for(var i = 0; i < old_value.length; i++){
            old_value[i]=old_value[i].replace("\t", "");
        }
        var new_value = old_value.join("\n");
        editor.getDoc().replaceSelection(new_value);
    }
    else{
        sendMessage("nothing selected", "error");
    }
}
function moveRight(){
    if(editor.getDoc().somethingSelected()){
        var old_value = editor.getDoc().getSelection().split("\n");
        for(var i = 0; i < old_value.length; i++){
            old_value[i]="\t"+old_value[i];
        }
        var new_value = old_value.join("\n");
        editor.getDoc().replaceSelection(new_value);
    }
    else{
        sendMessage("nothing selected", "error");
    }
}
/*****************
COMMENTS
*****************/
function line_comment(){
	if(editor.getDoc().somethingSelected()){
		var begin = editor.getCursor(true);
		var end = editor.getCursor(false);
		editor.lineComment(begin, end);
	}
	else{
		sendMessage("nothing selected", "error");
	}
}
function block_comment(){
	if(editor.getDoc().somethingSelected()){
		var begin = editor.getCursor(true);
		var end = editor.getCursor(false);
		editor.blockComment(begin, end);
	}
	else{
		sendMessage("nothing selected", "error");
	}
}
function uncomment(){
	if(editor.getDoc().somethingSelected()){
		var begin = editor.getCursor(true);
		var end = editor.getCursor(false);
		editor.uncomment(begin, end);
	}
	else{
		sendMessage("nothing selected", "error");
	}	
}
/***************
MORE MODALS
***************/
function tools(){
	$('#toolModal').modal('show');
}
function showRename(){
	$('#renameModal').modal('show');
}
function showMainModal(){
	$("#mainModal").modal('show');
}
function showModeModal(){
	$("#modeModal").modal('show');
}
function showThemeModal(){
	$("#themeModal").modal('show');
}
function showInfoModal(){
	$("#infoModal").modal('show');
}
function showOptionsModal(){
	$("#optionsModal").modal('show');
}
function showHelpModal(){
	$("#helpModal").modal('show');
}
function showExpModal(){
	$("#expModal").modal('show');
}
function showPreviewModal(){
	$('#previewModal').modal('show');
	setTimeout(function(){
		updatePreview();
	}, 500);
}
function showPub(){
	$("#publishModal").modal('show');
}
/**********
MINIFY
*********/
function minify(){
	var lines = editor.getValue().split("\n");
	for(var i = 0; i < lines.length; i++){
		lines[i] = lines[i].trim();
	}

	editor.setValue(lines.join(""), -1);
}

function switch_site(){
	var ext = "";
	if(document.URL.indexOf("#") !== -1){
		ext = document.URL.split("#")[1];
		ext = "#" + ext;
	}
	window.location = "https://codeyourcloud.com/" + ext;
}

var Environment = {
    //mobile or desktop compatible event name, to be used with '.on' function
    TOUCH_DOWN_EVENT_NAME: 'mousedown touchstart',
    TOUCH_UP_EVENT_NAME: 'mouseup touchend',
    TOUCH_MOVE_EVENT_NAME: 'mousemove touchmove',
    TOUCH_DOUBLE_TAB_EVENT_NAME: 'dblclick dbltap',

    isAndroid: function() {
        return navigator.userAgent.match(/Android/i);
    },
    isBlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    isIOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    isOpera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    isWindows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    isMobile: function() {
        return (Environment.isAndroid() || Environment.isBlackBerry() || Environment.isIOS() || Environment.isOpera() || Environment.isWindows());
    }
};
if(Environment.isMobile() !== null){
	to_mobile();
}
function to_mobile(){
	//$('#typeModal').modal('show');
}

function startIntro(){
	var intro = introJs();

	intro.start();
 }
 /*************
 OFFLINE
 *************/
 /*Offline.on("down", function(){
	 $(".offline-ui-content").html("Reconnecting...");
	 $(".offline-ui-retry").html("Retry");
 });
 Offline.on("up", function(){
	 $(".offline-ui-content").html("Reconnected!");
	 get_sql();
 });*/