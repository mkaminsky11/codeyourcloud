var trigger_auto = false;
var isWelcome = false; //welcome screen
$("#side").css("z-index", -1);
$("#container").css('backgroundColor', $(".CodeMirror").css('backgroundColor'));
$(".run-button").addClass('hide');
$(".html-button").addClass('hide');
var yes_context = true;
var is_html = false;
/**************
CONTEXT MENU
**************/
$(window).bind('contextmenu', function(e) {
   // do stuff here instead of normal context menu
   if(!yes_context){
   	return false;
   }
});
/*******************
ACE
*******************/
//other
var delay;
var title = "";
var isSaving = false;
var editor = ace.edit("editor");
ace.require("ace/ext/language_tools");
editor.on("change", function(e){
	setState("unsaved");
	changes_made = true;
	checkUndo(); //can you undo?
});
editor.session.setUseWrapMode(true);
editor.session.setWrapLimitRange();
editor.setShowFoldWidgets(true);
editor.setShowPrintMargin(false);
editor.getSession().selection.on('changeCursor', function(e){
	var display = editor.getCursorPosition().column + "|" + editor.getCursorPosition().row; 
	$("#indicator").html(display);
});
var Range = require('ace/range').Range;
/****************
NOTEPAD
****************/
var notepad = ace.edit("pad");
notepad.resize();
notes();
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
				editor.setValue(allText, -1);
			}
		}
	}
	txtFile.send(null);
	editor.session.selection.clearSelection();
}
/*********
MODES
*********/
var supportedModes = {
    ABAP:        ["abap"],
    ActionScript:["as"],
    ADA:         ["ada|adb"],
    Apache_Conf: ["^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd"],
    AsciiDoc:    ["asciidoc"],
    Assembly_x86:["asm"],
    AutoHotKey:  ["ahk"],
    BatchFile:   ["bat|cmd"],
    C9Search:    ["c9search_results"],
    C_Cpp:       ["cpp|c|cc|cxx|h|hh|hpp"],
    Cirru:       ["cirru|cr"],
    Clojure:     ["clj"],
    Cobol:       ["CBL|COB"],
    coffee:      ["coffee|cf|cson|^Cakefile"],
    ColdFusion:  ["cfm"],
    CSharp:      ["cs"],
    CSS:         ["css"],
    Curly:       ["curly"],
    D:           ["d|di"],
    Dart:        ["dart"],
    Diff:        ["diff|patch"],
    Dot:         ["dot"],
    Erlang:      ["erl|hrl"],
    EJS:         ["ejs"],
    Forth:       ["frt|fs|ldr"],
    FTL:         ["ftl"],
    Gherkin:     ["feature"],
    Glsl:        ["glsl|frag|vert"],
    golang:      ["go"],
    Groovy:      ["groovy"],
    HAML:        ["haml"],
    Handlebars:  ["hbs|handlebars|tpl|mustache"],
    Haskell:     ["hs"],
    haXe:        ["hx"],
    HTML:        ["html|htm|xhtml"],
    HTML_Ruby:   ["erb|rhtml|html.erb"],
    INI:         ["ini|conf|cfg|prefs"],
    Jack:        ["jack"],
    Jade:        ["jade"],
    Java:        ["java"],
    JavaScript:  ["js|jsm"],
    JSON:        ["json"],
    JSONiq:      ["jq"],
    JSP:         ["jsp"],
    JSX:         ["jsx"],
    Julia:       ["jl"],
    LaTeX:       ["tex|latex|ltx|bib"],
    LESS:        ["less"],
    Liquid:      ["liquid"],
    Lisp:        ["lisp"],
    LiveScript:  ["ls"],
    LogiQL:      ["logic|lql"],
    LSL:         ["lsl"],
    Lua:         ["lua"],
    LuaPage:     ["lp"],
    Lucene:      ["lucene"],
    Makefile:    ["^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make"],
    MATLAB:      ["matlab"],
    Markdown:    ["md|markdown"],
    MEL:         ["mel"],
    MySQL:       ["mysql"],
    MUSHCode:    ["mc|mush"],
    Nix:         ["nix"],
    ObjectiveC:  ["m|mm"],
    OCaml:       ["ml|mli"],
    Pascal:      ["pas|p"],
    Perl:        ["pl|pm"],
    pgSQL:       ["pgsql"],
    PHP:         ["php|phtml"],
    Powershell:  ["ps1"],
    Prolog:      ["plg|prolog"],
    Properties:  ["properties"],
    Protobuf:    ["proto"],
    Python:      ["py"],
    R:           ["r"],
    RDoc:        ["Rd"],
    RHTML:       ["Rhtml"],
    Ruby:        ["rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile"],
    Rust:        ["rs"],
    SASS:        ["sass"],
    SCAD:        ["scad"],
    Scala:       ["scala"],
    Smarty:      ["smarty|tpl"],
    Scheme:      ["scm|rkt"],
    SCSS:        ["scss"],
    SH:          ["sh|bash|^.bashrc"],
    SJS:         ["sjs"],
    Space:       ["space"],
    snippets:    ["snippets"],
    Soy_Template:["soy"],
    SQL:         ["sql"],
    Stylus:      ["styl|stylus"],
    SVG:         ["svg"],
    Tcl:         ["tcl"],
    Tex:         ["tex"],
    Text:        ["txt"],
    Textile:     ["textile"],
    Toml:        ["toml"],
    Twig:        ["twig"],
    Typescript:  ["ts|typescript|str"],
    VBScript:    ["vbs"],
    Velocity:    ["vm"],
    Verilog:     ["v|vh|sv|svh"],
    XML:         ["xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl"],
    XQuery:      ["xq"],
    YAML:        ["yaml|yml"]
};
//javascript = 40
var nameOverrides = {
    ObjectiveC: "Objective-C",
    CSharp: "C#",
    golang: "Go",
    C_Cpp: "C/C++",
    coffee: "CoffeeScript",
    HTML_Ruby: "HTML (Ruby)",
    FTL: "FreeMarker"
};
var modesByName = {};
var modes = new Array();
var modeNames = [];
var extensions = [];
for (var name in supportedModes) {
    var data = supportedModes[name]; //the data
    extensions.push(data);
    var displayName = (nameOverrides[name] || name).replace(/_/g, " ");
    modeNames.push(displayName);
    var filename = name.toLowerCase();
    var mode = require("ace/mode/" + filename).Mode; 	
    modesByName[filename] = mode;
    modes.push(mode);
    var onclick_name = "stuff." + data[0].split("|")[0];
    var onclick_html = new String("checkFileName('" + onclick_name + "')");
    var new_html = "<li class='list-group-item' onclick=\"" + onclick_html + "\">" + displayName + "</li>";  
    
    $(".mode_ul").html($(".mode_ul").html() + new_html);
}

function checkFileName(fileName){
	is_html = false;
	$(".run-button").addClass("hide");
	$(".html-button").addClass("hide");
	
	$("#console_toggle").addClass("hide");
	//BASIC AUTOCOMPLETE
	/*
	JAVASCRIPT
	*/
	if(fileName.indexOf(".js") !== -1){
		//javascript
		$(".run-button").removeClass("hide");
		$("#console_toggle").removeClass("hide");
	}
	if(fileName.indexOf(".html") !== -1){
		$(".html-button").removeClass("hide");
		is_html = true;
	}
	else{
		if(console_open){
			closeConsole();
			editor.resize();
		}
	}
	var e = exten(fileName);
	if(e !== "docx" && e !== "jpg" && e !== "png" && e !== "pptx" && e !== "jpeg" && e !== "xls"){
		for(var a = 0; a < extensions.length; a++){
				for(var b = 0; b < extensions[a].length; b++){
					var s = extensions[a][b].split("|");
					for(var c= 0; c < s.length; c++){
					if(s[c] === e){
						if(e === "ino" || e === "pde"){
							editor.getSession().setMode(new modes[39]());
						}
						else if(e === "php" || e === "phtml"){
							editor.getSession().setMode({path:"ace/mode/php", inline:true})
						}
						else{
							editor.getSession().setMode(new modes[a]());
						}
						sendMessage("Mode changed!", "success");
					}
				}
			}
		}
	}
	else{
		badType();
	}
}
function basicAuto(){
	editor.setOptions({
		enableBasicAutocompletion: true
	});
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
/*********
THEMES
*********/
var themeData = [
    ["Chrome"],
    ["Clouds"],
    ["Crimson Editor"],
    ["Dawn"],
    ["Dreamweaver"],
    ["Eclipse"],
    ["GitHub"],
    ["Solarized Light"],
    ["TextMate"],
    ["Tomorrow"],
    ["XCode"],
    ["Kuroir"],
    ["KatzenMilch"],
    ["Ambiance","ambiance"],
    ["Chaos","chaos"],
    ["Clouds Midnight","clouds_midnight"],
    ["Cobalt","cobalt"],
    ["idle Fingers","idle_fingers"],
    ["krTheme","kr_theme"],
    ["Merbivore","merbivore" ],
    ["Merbivore Soft","merbivore_soft"],
    ["Mono Industrial","mono_industrial"],
    ["Monokai","monokai"],
    ["Pastel on dark","pastel_on_dark"],
    ["Solarized Dark","solarized_dark"],
    ["Terminal","terminal"],
    ["Tomorrow Night","tomorrow_night"],
    ["Tomorrow Night Blue","tomorrow_night_blue"],
    ["Tomorrow Night Bright","tomorrow_night_bright"],
    ["Tomorrow Night 80s","tomorrow_night_eighties"],
    ["Twilight","twilight"],
    ["Vibrant Ink","vibrant_ink"]
];
for(var i = 0; i < themeData.length; i++){
	var theme_name = "";
	var theme_formal_name = "";
	if(themeData[i].length == 2){
		theme_name = themeData[i][0];
		theme_formal_name = themeData[i][1];
	}
	else{
		theme_name = themeData[i][0];
		theme_formal_name = themeData[i][0].toLowerCase();
	}
	var theme_html = "<li class='list-group-item' onclick=\"setTheme('" + theme_formal_name + "')\">" + theme_name + "</li>"
	$(".theme_ul").html($(".theme_ul").html() + theme_html);
}
editor.setTheme("ace/theme/monokai");
function setTheme(theme_name){
	editor.setTheme("ace/theme/" + theme_name);
	theme_sql = theme_name;
	set_sql();
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
	//don't send it to other users
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

function navUndo() {
	if(editor.getSession().getUndoManager().hasUndo()){
		editor.undo();
	}
	else{
		addClass("undoB", "disabled");
	}
	checkUndo();
}
function checkUndo(){
	if(editor.getSession().getUndoManager().hasUndo()){
		removeClass("undoB", "disabled");	
	}
	else{
		addClass("undoB", "disabled");
	}
	if(editor.getSession().getUndoManager().hasRedo()){
		removeClass("redoB", "disabled");
	}
	else{
		addClass("redoB", "disabled");
	}
}
function navRedo() {
	if(editor.getSession().getUndoManager().hasRedo()){
		editor.redo();
	}
	else{
		addClass("redoB", "disabled");
	}
	checkUndo();
}
/************
PREFERENCES
************/
function line_numbers() {
	if(line_number){
		editor.renderer.setShowGutter(false); 
		line_number = false;
	}
	else{
		editor.renderer.setShowGutter(true);
		line_number = true;
	}
	set_sql();
}
function line_wrap() {
	if(editor.session.getUseWrapMode()){
		editor.session.setUseWrapMode(false);
	}	
	else{
		editor.session.setUseWrapMode(true);
		editor.session.setWrapLimitRange();
	}
	set_sql();
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
	require("ace/config").loadModule("ace/ext/searchbox", function(e) {
    	e.Search(editor, false)  
	});
}
function REPLACE(){
	require("ace/config").loadModule("ace/ext/searchbox", function(e) {
    	e.Search(editor, true)  
	});
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
	/*
	document.getElementById("desc").innerHTML = per + "% complete";
	document.getElementById("prog").style.width = per + "%";
	document.getElementById("prog").ariaValuenow = per + "";	
	*/	
	if(per === "100"){
		setTimeout(function(){
			$("#screen").animate({
				marginTop: "-100%",
				marginBottom: "100%"
			},750,function(){
				//$("#pre").remove();
				$("#screen").remove();
				//$('#ok_rename').tooltip('hide');
				//$('#cancel_rename').tooltip('hide');
			});
		}, 1000);
	}
	/*
	if(per === "0"){
	}*/
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
/**********
SHOW HINT
**********/
function getHint(){
	editor.execCommand("startAutocomplete");
	yes_context = false;
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
		$("#console").animate({
			width: "80%",
			marginLeft: "20%"
		}, 500);
		editor.resize();
		con.resize();
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
		$("#console").animate({
			width: "100%",
			marginLeft: "0%"
		}, 500);
		editor.resize();
		con.resize();
	}, 500);
}
//on startup
sideOpen = false;
document.getElementById("content").style.width = "100%";
document.getElementById("the-arrow").innerHTML = "<i class='fa fa-caret-square-o-left'></i>";
$("#side-arrow").attr("onclick","openSide()");

function bootHide(id){
	$("#"+id).addClass("hide");
}
function notes(){
    if(sideView !== 1){
		sideView = 1;
		removeClass("pad", "hide");
		bootHide("todo");
		bootHide("docs");
    }
}
function docs(){
    if(sideView !== 2){
		sideView = 2;
		removeClass("docs", "hide");
		bootHide("pad");
		bootHide("todo");
    }
}
function todo(){
    if(sideView !== 3){
		sideView = 3;
		removeClass("todo", "hide");
		bootHide("docs");
		bootHide("pad");
		refreshTodo("");
		editor.focus();
		editor.session.selection.moveCursorLeft();
		editor.session.selection.moveCursorRight();
    }
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
	var line = Number(s[1]);
	var lines= editor.getValue().split("\n");
	console.log(lines);
	lines[line] = "";
	var fin = lines.join("\n");
	editor.setValue(fin,-1);
	$("#"+todoId).remove();
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
	var found_one = false;
	$("#todo_ul").html("");
	$("#search_todo").val(sort);
	var code = editor.getValue();
	var lines = code.split("\n");
	for(var i = 0; i < lines.length; i++){
		var done = false;
		if(lines[i].indexOf("NOTE:") !== -1){
			done = true;
			var token = lines[i].split("NOTE:")[1];
			if(token.indexOf(sort) !== -1){
				createTodo(token, i, 0, "note");
				$("#nothing").addClass("hide");
				found_one = true;
			}
		}
		if(lines[i].indexOf("TODO:") !== -1 && done === false){
			done = true;
			var token = lines[i].split("TODO:")[1];
			if(token.indexOf(sort) !== -1){
				createTodo(token, i, 1, "todo");
				$("#nothing").addClass("hide");
				found_one = true;
			}
		}
		if(lines[i].indexOf("FIXME:") !== -1 && done === false){
			var token = lines[i].split("FIXME:")[1];
			if(token.indexOf(sort) !== -1){
				createTodo(token, i, 2, "fixme");
				$("#nothing").addClass("hide");
				found_one = true;
			}
		}
	}
	if(!found_one){
		$("#nothing").removeClass("hide");
	}
}
$( "#search_todo" ).keypress(function() {
  refreshTodo($("#search_todo").val());
});
function removeClass(id, classToRemove){
	$("#" + id).removeClass(classToRemove);
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
    if(editor.getCopyText() !== ""){
    	try{
	    	$("#color").colorpicker('setValue', editor.getCopyText());
	    }
	    catch(e){
	    }
    }
    
}
var before = null;
var after = null;
$('#color').colorpicker().on('changeColor', function(ev){
  if(!editor.session.selection.isEmpty()){
	  var selection = editor.session.selection.getRange();
	  editor.session.doc.replace(selection, ev.color.toHex());
	  editor.session.selection.setSelectionAnchor(selection.start.row, selection.start.column);
  }
  else{
	  before = editor.session.selection.getCursor();
	  editor.insert(ev.color.toHex());
	  after = editor.session.selection.getCursor();
	  var range = new Range(before.column, before.row, after.column, after.row);
	  editor.session.selection.setSelectionAnchor(before.row, before.column);
  }
});

$('#nav_color').colorpicker();
function showNavColor(){
    $('#nav_color').colorpicker('show');
    $('.colorpicker').css("opacity", 100);
    $('.colorpicker').css('visibility', 'visible');
}
$('#nav_color').colorpicker().on('changeColor', function(ev){
    $(".navbar-inverse").css("background-color", ev.color.toHex());
});
/************
MOVE RIGHT/LEFT
************/
function moveLeft(){
    if(editor.getCopyText() !== ""){
		editor.blockOutdent();
    }
    else{
        sendMessage("nothing selected", "error");
    }
}
function moveRight(){
    if(editor.getCopyText() !== ""){
        editor.indent();
    }
    else{
        sendMessage("nothing selected", "error");
    }
}
/*****************
COMMENTS
*****************/
function toggle_comment(){
	editor.toggleCommentLines()
}
/************
CONSOLE
************/
var console_open = false;
var wys = false; //wysiwyg = what you see is what you get
function openConsole(){
	if(!console_open){
		console_open = true;
		$("#content").animate({
			height: "61%"
		}, 1000, function(){
			editor.resize();
			con.resize();
		});
	}
}
function closeConsole(){
	if(console_open){
		console_open = false;
		$("#content").animate({
			height: "99%"
		}, 1000, function(){
			editor.resize();
			con.resize();
		});
	}
}

var con = ace.edit("console_screen");
con.session.setMode("ace/mode/javascript");
con.setTheme("ace/theme/cobalt");
con.setReadOnly(true);

clearConsole();
function printToConsole(toPrint){
	con.setValue(con.getValue() + "\n>> " + toPrint, -1);
}
function clearConsole(){
	con.setValue(">>", -1);
}
function toggle_console(){
	if(console_open){
		closeConsole();
	}
	else{
		openConsole();
	}
}
/***************
MORE MODALS
***************/
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
	window.location = "https://codeyourcloud.com/mobile" + ext;
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
 Offline.on("down", function(){
	 $(".offline-ui-content").html("Reconnecting...");
	 $(".offline-ui-retry").html("Retry");
 });
 Offline.on("up", function(){
	 $(".offline-ui-content").html("Reconnected!");
	 get_sql();
 });
 
 /**************
 WYSIWYG
 **************/
 function open_wys(){
	if(!wys){
		wys = true;
		$("#editor").animate({
			height: '0%'
		}, { duration: 1000, queue: false });
		$("#edit").animate({
			height: '100%'
		}, { duration: 1000, queue: false });
	}
 }
 function close_wys(){
	if(wys){
		wys = false;
		$("#editor").animate({
			height: '100%'
		}, { duration: 1000, queue: false });
		$("#edit").animate({
			height: '0%'
		}, { duration: 1000, queue: false });
	}
 }
 
 

var quill = new Quill('#quill');
quill.addModule('toolbar', {
  container: '#toolbar'
});

