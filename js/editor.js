/**
* FIND/REPLACE
* find and replace for editors
**/

function find(){
	CodeMirror.commands["findNext"](editor());
}
function replace(){
	CodeMirror.commands["replace"](editor());
}

/**
* MODES
* change the mode
**/

function setMode(id,mode){
	try{ //update the select
		if(mode !== $("#mode-select").val()){
			$("#mode-select").val(mode);
		}
	}
	catch(e){}

	//sets default codemirror options
	//gutters + lints
	var index = getIndex(id);
	editors[index].editor.setOption("extraKeys", {});
	editors[index].editor.setOption("gutters",["CodeMirror-linenumbers"]);
	editors[index].editor.setOption("lint",false);


	if(mode === "text/javascript"){
		editors[index].editor.setOption("gutters",["CodeMirror-lint-markers"]);
		editors[index].editor.setOption("lint",CodeMirror.lint.javascript);
		startTern(index);
	}
	else if(mode === "text/html"){
		editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
		editors[index].editor.on("inputRead", function(cm, change){
			if(change.text[0] === "/" || change.text[0] === "<"){
				CodeMirror.showHint(editors[index].editor, CodeMirror.hint.html);	
			}
		});
	}
	else if(mode === "text/css"){
		editors[index].editor.setOption("gutters",["CodeMirror-lint-markers"]);
		editors[index].editor.setOption("lint",CodeMirror.lint.css);
		editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
	}
	else if(mode === "application/json"){
		editors[index].editor.setOption("gutters",["CodeMirror-lint-markers"]);
		editors[index].editor.setOption("lint",CodeMirror.lint.json);
	}
	else if(mode === "text/x-python"){editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});}
	else if(mode === "text/x-sql"){editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});}
	editors[index].editor.setOption("mode", mode); //finally, set the mode
	
	adjust(); //adjust the ide
}
//gets the extension of a file
function extension(fileName){
	var ext = "txt";
	var hidden = false;
	
	if(fileName.charAt(0) === "."){hidden = true;} 
	else{
		ext = fileName.split(".").reverse()[0]
	}
	return {ext: ext, hidden: hidden}; //hidden like .DS_STORE or .vimrc
}
//get the mode for a given filename
function checkMode(id, fileName){
	var ext_info = extension(fileName);
	var mode_to_use = "text"; //default
	if(ext_info.hidden === false){
		for(var i = 0; i < modes.length; i++){
			var possible_mime = modes[i].mime;
			var exts = modes[i].ext;
			
			try{
				if(exts.indexOf(ext_info.ext) !== -1){
					mode_to_use = possible_mime;
				}
			}
			catch(e){}
		}
	}
	setMode(id,mode_to_use);
}
//function called when mode select changed
function modeChange(){
	setMode(current_file,$("#mode-select").val());
}
//populates the mode select
for(var i = 0; i < modes.length; i++){
	$("#mode-select").html($("#mode-select").html() + "<option value='"+modes[i].mime+"'>"+modes[i].name+"</option>");
}


/**
* UNDO/REDO
**/
function editorUndo() {
	editor().getDoc().undo();
}
function editorRedo() {
	editor().getDoc().redo();
}

/**
* THEMES
* change the theme
**/

//function called when select changed
function themeChange(){
	setTheme($("#theme-select").val());
}
function setTheme(theme){	
	//$(".mini").css("background-color",$(".CodeMirror").css("background-color"));	
	localStorage.setItem("theme", theme);
	for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("theme",theme);
	}
	editor_theme = theme;
}
//populates theme select
for(var j = 0; j < themes.length; j++){	
	$("#theme-select").html($("#theme-select").html() + "<option value='"+themes[j].split(" ").join("-").toLowerCase()+"'>"+themes[j]+"</option>");
}

/**
* FONTS
* change the fonts
**/
function fontChange(){
	$(".CodeMirror").css("fontSize", $("#font-select").val() +"px");	
}

//populates the font select
for(var k = 2; k <= 30; k++){
	$("#font-select").html($("#font-select").html() + "<option value='" + k + "'>" + k + "</option>");
}

//sets default settings
$("#mode-select").val("text/plain");
$("#theme-select").val("monokai");
$("#font-select").val("12");

/**
* OPTIONS
* line numbers, line wrap, font size
**/
function lineNumber() {
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
}
function lineWrap() {
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
}

/**
* HINTS
* hints and autocomplete
**/
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
//JAVASCRIPT
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