if(is_mobile){
	//mobile-specific
}
//find and replace functions
function find(){
	CodeMirror.commands["findNext"](editor());
}
function replace(){
	CodeMirror.commands["replace"](editor());
}


function setMode(id,mode){
	//get the current editor index
	try{	
		if(mode !== mode_select.value){
			mode_select.change(mode);
		}
	}
	catch(e){}
	var index = getIndex(id);

	editors[index].editor.setOption("extraKeys", {});
	editors[index].editor.setOption("gutters",["CodeMirror-linenumbers"]);
	editors[index].editor.setOption("lint",false);
	//if javascript
	if(mode === "text/javascript"){
		editors[index].editor.setOption("gutters",["CodeMirror-lint-markers"]);
		editors[index].editor.setOption("lint",CodeMirror.lint.javascript);
		startTern(index);
	}
	else if(mode === "text/x-coffeescript"){
	}
	else if(mode === "text/html"){
		startHtml(index);
	}
	else if(mode === "text/x-markdown" || mode === "gfm"){
	}
	else if(mode === "text/css"){
		editors[index].editor.setOption("gutters",["CodeMirror-lint-markers"]); //<-----------
		editors[index].editor.setOption("lint",CodeMirror.lint.css); //<-----------
		startCss(index);
	}
	else if(mode === "application/json"){
		editors[index].editor.setOption("gutters",["CodeMirror-lint-markers"]);
		editors[index].editor.setOption("lint",CodeMirror.lint.json);
	}
	else if(mode === "text/x-python"){
		startPython(index);
	}
	else if(mode === "text/x-sql"){
		startSql(index);
	}
	
	editors[index].editor.setOption("mode", mode);
	
	adjust();
}
function ok_rename(){
	setFileTitle(current_file, $("#title").val());
	sendData({
		type: "title",
		title: $("#title").val()
	}, current_file);
}
/*============
MODES
==============*/
function check_mode(id, fileName){
	var ext = "";
	if(fileName.charAt(0) === "."){
		ext = fileName.replace(".","");
	}
	else if(fileName.indexOf(".") !== -1){
		var ext_array = fileName.split(".");
		ext = ext_array[ext_array.length - 1];
	}
	
	var mode_to_use = "";
	
	for(var i = 0; i < modes.length; i++){
		var possible_mime = modes[i].mime;
		var exts = modes[i].ext;
		
		try{
			if(exts.indexOf(ext) !== -1){
				mode_to_use = possible_mime;
			}
		}
		catch(e){}
	}
	
	setMode(id,mode_to_use);
}

function modeChange(){
	setMode(current_file,mode_select.value);
}

for(var i = 0; i < modes.length; i++){
	var name = modes[i].name;
	var the_mode = modes[i].mime;
	
	var sel = "<option value='"+the_mode+"'>"+name+"</option>";
	$("#mode-select").html($("#mode-select").html() + sel);
}


/*===========
UNDO/REDO
===========*/
var numUndo = 0;
var numRedo = 0;
function editor_undo() {
	editor().getDoc().undo();
}
function editor_redo() {
	editor().getDoc().redo();
}

/*==========
THEMES
===========*/
function themeChange(){
	setTheme(theme_select.value);
}
function setTheme(theme){
	for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("theme",theme);
	}
	
	theme_sql = theme;
	set_sql();
}
function showTheme(){
	$("#themeModal").modal('show');
}
for(var j = 0; j < themes.length; j++){
	var the_name = themes[j];
	var the_theme = the_name.split(" ").join("-").toLowerCase();
	
	var sel = "<option value='"+the_theme+"'>"+the_name+"</option>";
	$("#theme-select").html($("#theme-select").html() + sel);
}

mode_select =  new Select({
    el: $('#mode-select')[0],
    className: 'select-theme-default',
    alignToHighlighted: 'never'
  });
  theme_select = new Select({
    el: $('#theme-select')[0],
    className: 'select-theme-default',
    alignToHighlighted: 'never'
  });
mode_select.change("text");
theme_select.change("seti");

/*===============
SWITCHES
===============*/
function line_number_switch() {
	if(line_number){
		for(var i = 0; i < editors.length; i++){
			editors[i].editor.setOption("lineNumbers",false);
		}
		line_number = false;
	}
	else{
		for(var i = 0; i < editors.length; i++){
			editors[i].editor.setOption("lineNumbers",true);
		}
		line_number = true;
	}
	set_sql();
}
function line_wrap_switch() {
	if(editor().getOption("lineWrapping")){
		for(var i = 0; i < editors.length; i++){
			editors[i].editor.setOption("lineWrapping",false);
		}
		line_wrap = false;
	}	
	else{
		for(var i = 0; i < editors.length; i++){
			editors[i].editor.setOption("lineWrapping",true);
		}
		line_wrap = true;
	}
	set_sql();
}

function fontUp(){
set_sql();
}

/*============
LOREM
==============*/
var lorem_type = "s";
function generate(){
    $("#lorem").html("");
    var lorem = new Lorem;
    lorem.type = Lorem.TEXT;
    lorem.query = document.getElementById("lorem_input").value + lorem_type;
    lorem.createLorem(document.getElementById('lorem'));
}
function lorem_s(){
	lorem_type = "s";
}
function lorem_w(){
	lorem_type = "w";
}
function lorem_p(){
	lorem_type = "p";
}
/*==============
CONSOLE
==============*/

function run(){
	var code_before_replace = editor().getValue();
	if(editor().getOption("mode") === "text/x-coffeescript"){
		code_before_replace = CoffeeScript.compile(code_before_replace, { bare: true });
	}
	var find = 'console.log';
	var re = new RegExp(find, 'g');
	code_before_replace = code_before_replace.replace(re, 'print');
	
	
	document.getElementById('repl-iframe').contentWindow.eval(code_before_replace);
}



/*=========
COLOR
==========*/
function show_color(){
	$("#colorModal").modal('show');
}
$("#custom").spectrum({
	preferredFormat: "hex",
    showInput: true,
    clickoutFiresChange: true,
    showInitial: true,
    showButtons: false,
    move: function(tinycolor) { 
		var color = tinycolor.toHexString();
		//insert this
		var before = editor().getDoc().getCursor();
		if(editor().getDoc().somethingSelected()){
			editor().getDoc().replaceSelection(color);
		}
		else{
			editor().getDoc().replaceRange(""+color, before);
		}
		var after = editor().getDoc().getCursor();
		//else{
		editor().getDoc().setSelection(before, after);
  		//}
    },
    beforeShow: function(tinycolor) { 
    	//if something selected, set color
    	//$("#custom").spectrum("set", colorString);
    }
});

function set_color(string){
	if(/^#[0-9A-F]{6}$/i.test(string)){
		$("#custom").spectrum("set",string);
	}
}
/*=========
JAVASCRIPT
=========*/
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
function startTern(index){
	getURL("https://codeyourcloud.com/lib/auto/ecma5.json", function(err, code) {
		if (err) throw new Error("Request for ecma5.json: " + err);
		server = new CodeMirror.TernServer({defs: [JSON.parse(code)]});
		editors[index].editor.setOption("extraKeys", {
			"Ctrl-Space": function(cm) {
				server.complete(editor());
			},
			"Ctrl-I": function(cm) { server.showType(cm); },
			"Ctrl-.": function(cm) { server.jumpToDef(cm); },
			"Ctrl-,": function(cm) { server.jumpBack(cm); },
			"Ctrl-Q": function(cm) { server.rename(cm); }
		})
		editors[index].editor.on("cursorActivity", function(cm) { server.updateArgHints(editors[index].editor); });
		});
}
/*========
HINTS
=========*/
function getHint(){
	if(editor().getOption("mode") === "text/javascript"){
		server.updateArgHints(editor());
	}
	else if(editor().getOption("mode") === "text/css"){
		CodeMirror.showHint(editor(), CodeMirror.hint.css);
	}
	else if(editor().getOption("mode") === "text/html"){
		CodeMirror.showHint(editor(), CodeMirror.hint.html);
	}
	else if(editor().getOption("mode") === "text/x-python"){
		CodeMirror.showHint(editor(), CodeMirror.hint.python);
	}
	else if(editor().getOption("mode") === "text/x-sql"){
		CodeMirror.showHint(editor(), CodeMirror.hint.sql);
	}
}
var dummy = null;
var tags = null;

function startXml(index){
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
      editors[index].editor.setOption("extraKeys", {
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
function startHtml(index){
	editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
	editors[index].editor.on("inputRead", function(cm, change){
		if(change.text[0] === "/" || change.text[0] === "<"){
			CodeMirror.showHint(editors[index].editor, CodeMirror.hint.html);	
		}
	});
}
/********
CSS
********/
function startCss(index){
	editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
/*******
SQL
*******/
function startSql(index){
	editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
/********
PYTHON
********/
function startPython(index){
	editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
/*========
NEW FILE
==========*/
function new_file(){
	insertNewFile(myRootFolderId);
}
/*========
PREVIEW
=========*/
function showPreview(){
	updatePreview();
	$("#previewModal").modal('show');
}
function updatePreview() {
	var allPreviews = document.getElementsByClassName('preview-frame');
	for(var i = 0; i < allPreviews.length; i++){
	    var previewFrame = allPreviews[i];
		var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
		preview.open();
		var c = editor().getValue();
		if(editor().getOption("mode") === "text/x-markdown" || editor().getOption("mode") === "gfm"){
			c = converter.makeHtml(c);
		}
		preview.write(c);
		preview.close();
	}
}

/*=====
CHAT
=======*/
$(".chats-text").keyup(function(event){
    if(event.keyCode == 13){
        sendChat();
    }
});

function show_loading_spinner(){
	document.getElementById("paper-loading-spinner").active = true;
	$("#paper-loading-spinner").css("display","block");
}

function hide_loading_spinner(){
	document.getElementById("paper-loading-spinner").active = false;
	$("#paper-loading-spinner").css("display","none");
}

function show_top_rename(){
	//$("#title").addClass("input").removeClass("no-input");
	$('#title').attr('readonly', false);
}

function hide_top_rename(){
	//$("#title").addClass("no-input").removeClass("input");
	$('#title').attr('readonly', true);
}

function toggle_rename_show(){
	if($('#title').attr('readonly')){
		//if disabled
		show_top_rename();
	}
	else{
		hide_top_rename();
		ok_rename();
	}
}

var modal_open = false;

function toggle_side(){
	if(side_open){
		side_open = false;
		close_side();
	}	
	else{
		side_open = true;
		open_side();
	}
}

function close_side(){
	side_open = false;
	
	
	$("#side").velocity({
		marginLeft: -300
	},{
		duration: 500,
		queue: false,
		complete: function(){
			$("#side").css("display","none").css("margin-left","0px");
		}
	});
	
	$(".move").velocity({
		marginLeft: 0
	},{
		duration: 500,
		queue: false
	});
	
	$("#mini").velocity({
		right: 0
	},{
		duration: 500,
		queue: false
	});
	
	//$("#toggle_side_menu_button").attr("shape","menu");
}

function open_side(){

	side_open = true;

	
	$("#side").css("display","block").css("margin-left","-300px");
	
	
	$("#side").velocity({
		marginLeft: 0
	},{
		duration: 500,
		queue: false
	});
	
	$(".move").velocity({
		marginLeft: 300
	},{
		duration: 500,
		queue: false
	});
	
	$("#mini").velocity({
		right: "-300px"
	},{
		duration: 500,
		queue: false
	});
	
	//$("#toggle_side_menu_button").attr("shape","cancel");
}

/*========
DIALOGS
=========*/
function show_side_open(){
	//the open dialog
	close_side();
	open_picker()
}
function show_side_share(){
	//share dialog
	close_side();
	show_share()
}
function show_side_upload(){
	//upload dialogs
	close_side();
	upload_picker();
}

function nav_list(){
	if($("#nav_list").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_list").addClass("active");
		
		$(".side-store").css("display","block");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".chats").css("display","none");
		$(".tree-tree").css("display","none");
	}
}

function nav_preview(){
	if($("#nav_preview").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_preview").addClass("active");
		
		$(".side-store").css("display","none");
		$(".preview").css("display","block");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".chats").css("display","none");
		$(".tree-tree").css("display","none");
	}
}

function nav_lorem(){
	if($("#nav_lorem").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_lorem").addClass("active");
		
		$(".side-store").css("display","none");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","block");
		$(".options").css("display","none");
		$(".chats").css("display","none");
		$(".tree-tree").css("display","none");
	}
}

function nav_terminal(){
	if($("#nav_terminal").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_terminal").addClass("active");
		
		$(".side-store").css("display","none");
		$(".preview").css("display","none");
		$(".terminal").css("display","block");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".chats").css("display","none");
		$(".tree-tree").css("display","none");
	}
}

function nav_options(){
	if($("#nav_options").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_options").addClass("active");
		
		$(".side-store").css("display","none");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","block");
		$(".chats").css("display","none");
		$(".tree-tree").css("display","none");
	}
}

function nav_chats(){
	if($("#nav_chats").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_chats").addClass("active");
		
		$(".side-store").css("display","none");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".chats").css("display","block");
		$(".tree-tree").css("display","none");
	}
}

function nav_tree(){
	if($("#nav_tree").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_tree").addClass("active");
		
		$(".side-store").css("display","none");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".chats").css("display","none");
		$(".tree-tree").css("display","block");
	}
}

function read_image(file_id_id){
	var index = getIndex(file_id_id);

	if(editors[index].image !== true && editors[index].image){
		//just open it
		$("#image_div").css("display", "flex");
		$("#image_div").html("<img src='" + editors[index].image + "'>");
	}	
	else{
		getFile(file_id_id, function(resp){
			console.log(resp);
			var url = resp.thumbnailLink;

			editors[index].image = url;		

			$("#image_div").css("display","flex");
			$("#image_div").html("<img src='" + url  + "'>");
		});
	}
}

$(document).ready(function() {

	checkGithub(); //declared in broadcast.js
	//sets options
	line_wrap = editor().getOption("lineWrapping");
	line_number = editor().getOption("lineNumbers");
	if(line_wrap !== $('#side-wrap').prop('checked')){
		document.getElementById("side-wrap").toggle();
	}
	
	if(line_number !== $('#side-nums').prop('checked')){
		document.getElementById("side-nums").toggle();
	}

	editor().refresh();
});

function setFocusThickboxIframe() {
    var iframe = $("#repl-iframe")[0];
    iframe.contentWindow.focus();
}

$(".dial").knob({
	change: function(value){
		var f = value;
		sql_font = Number(f);
		$(".CodeMirror").css("fontSize", f+"px");	
	}
});

var anchor = document.querySelectorAll('#toggle_side_menu_button');
    
[].forEach.call(anchor, function(anchor){
	var open = false;
	anchor.onclick = function(event){
		event.preventDefault();
		toggle_side()
		if(!open){
			this.classList.add('close');
			open = true;
		}
		else{
			this.classList.remove('close');
			open = false;
		}
	}
}); 