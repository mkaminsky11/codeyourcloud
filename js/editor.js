/*===
* CODEYOURCLOUD
*
* editor.js built by Michael Kaminsky
* manages the editor + options
*
* contents:
===*/

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
	else if(mode === "text/x-coffeescript"){
	}
	else if(mode === "text/html"){
		startHtml(index);
	}
	else if(mode === "text/x-markdown" || mode === "gfm"){
	}
	else if(mode === "text/css"){
		editors[index].editor.setOption("gutters",["CodeMirror-lint-markers"]);
		editors[index].editor.setOption("lint",CodeMirror.lint.css);
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
	editors[index].editor.setOption("mode", mode); //finally, set the mode
	
	adjust(); //adjust the ide
}
//gets the extension of a file
function extension(fileName){
	var ext = "txt";
	var hidden = false;
	
	if(fileName.charAt(0) === "."){
		hidden = true;
	} else {
		var array = fileName.split(".");
		ext = array[array.length - 1];
	}
	return {ext: ext, hidden: hidden}; //hidden like .DS_STORE or .vimrc
}
//get the mode for a given filename
function check_mode(id, fileName){
	var ext_info = extension(fileName);
	var hidden = ext_info.hidden;
	var ext = ext_info.ext;
	var mode_to_use = "text"; //default
	if(hidden === false){
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
	}
	setMode(id,mode_to_use);
}
//function called when mode select changed
function modeChange(){
	setMode(current_file,$("#mode-select").val());
}
//populates the mode select
for(var i = 0; i < modes.length; i++){
	var name = modes[i].name;
	var the_mode = modes[i].mime;
	
	var sel = "<option value='"+the_mode+"'>"+name+"</option>";
	$("#mode-select").html($("#mode-select").html() + sel);
}


/**
* UNDO/REDO
**/
function editor_undo() {
	editor().getDoc().undo();
}
function editor_redo() {
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
	for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("theme",theme);
	}
	editor_theme = theme;
}
//populates theme select
for(var j = 0; j < themes.length; j++){
	var the_name = themes[j];
	var the_theme = the_name.split(" ").join("-").toLowerCase();
	
	var sel = "<option value='"+the_theme+"'>"+the_name+"</option>";
	$("#theme-select").html($("#theme-select").html() + sel);
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
	var sel = "<option value='" + k + "'>" + k + "</option>";
	$("#font-select").html($("#font-select").html() + sel);
}

//sets default settings
$("#mode-select").val("text");
$("#theme-select").val("seti");
$("#font-select").val("12");

/**
* OPTIONS
* line numbers, line wrap, font size
**/
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

//XML
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
//HTML
function startHtml(index){
	editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
	editors[index].editor.on("inputRead", function(cm, change){
		if(change.text[0] === "/" || change.text[0] === "<"){
			CodeMirror.showHint(editors[index].editor, CodeMirror.hint.html);	
		}
	});
}
//CSS
function startCss(index){
	editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
//SQL
function startSql(index){
	editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
}
//PYTHON
function startPython(index){
	editors[index].editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
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