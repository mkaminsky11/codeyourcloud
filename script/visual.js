if(is_mobile){
	$("#col_button").bind("tap",function() {  
		switch_col();
	});
	$("#find_button").bind("tap",function() {  
		find();
	});
	$("#replace_button").bind("tap",function() {  
		replace();
	});
	$("#pref_button").bind("tap",function(){
		$('#mainModal').modal('show');
	});
}
function find(){
	CodeMirror.commands["findNext"](editor());
}
function replace(){
	CodeMirror.commands["replace"](editor());
}



function setMode(id,mode){
	
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
	setFileTitle(current_file, $("#rename_input").val());
	
	sendData({
		type: "title",
		title: $("#rename_input").val()
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
		ext = fileName.split(".")[1];
	}
	
	var mode_to_use = "";
	
	for(var i = 0; i < modes.length; i++){
		if(modes[i][2] !== ""){
			var possible = modes[i][2].split("|");
			for(var j = 0; j < possible.length; j++){
				if(possible[j] === ext){
					mode_to_use = modes[i][1];
				}
			}
		}
	}
	
	setMode(id,mode_to_use);
}



for(var i = 0; i < modes.length; i++){
	var name = modes[i][0];
	var the_mode = modes[i][1];
	var elem = "<li class=\"list-group-item text-center mode-li\" onclick=\"setMode(current_file,'"+ the_mode +"')\">"+ name +"<paper-ripple></paper-ripple></li>";
	$("#mode-ul").html($("#mode-ul").html() + elem);
}


function mode_search_change(){
	var search_term = $("#mode_input").val();
	
	var found = false;
	$("#mode-nothing").removeClass("hide");
	$(".mode-li").each(function(index){
		if(search_term === ""){
			found = true;
			$(this).css("display","block");
		}
		else{
			var li_term = $(this).html();
			if(li_term.toLowerCase().indexOf(search_term.toLowerCase()) !== -1){
				found = true;
				$(this).css("display","block");
			}
			else{
				$(this).css("display","none");
			}
		}
	});
	
	if(found){
		$("#mode-nothing").addClass("hide");
	}
}

function theme_search_change(){
	var search_term = $("#theme_input").val();
	
	var found = false;
	$("#theme-nothing").removeClass("hide");
	$(".theme-li").each(function(index){
		if(search_term === ""){
			found = true;
			$(this).css("display","block");
		}
		else{
			var li_term = $(this).html();
			if(li_term.toLowerCase().indexOf(search_term.toLowerCase()) !== -1){
				found = true;
				$(this).css("display","block");
			}
			else{
				$(this).css("display","none");
			}
		}
		
		if(found){
			$("#theme-nothing").addClass("hide");
		}
	});
}

$('#mode_input').keyup(function(e){
	mode_search_change();
});
$('#theme_input').keyup(function(e){
	theme_search_change();
});

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
	var elem = "<li class=\"list-group-item text-center theme-li\" onclick=\"setTheme('"+ the_theme +"')\">"+ the_name +"<paper-ripple></paper-ripple></li>";
	$("#theme-ul").html($("#theme-ul").html() + elem);
}
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

document.getElementById("spinner-font").addEventListener('change',function(){
	var f = document.getElementById("spinner-font").value;
	sql_font = Number(f);
	$(".CodeMirror").css("fontSize", f+"px");
});

/*=============
MOVE LEFT/RIGHT
==============*/
function move_left(){
    if(editor().getDoc().somethingSelected()){
        var old_value = editor().getDoc().getSelection().split("\n");
        for(var i = 0; i < old_value.length; i++){
            old_value[i]=old_value[i].replace("\t", "");
        }
        var new_value = old_value.join("\n");
        editor().getDoc().replaceSelection(new_value);
    }
    else{
        document.querySelector("#toast-select").show();
    }
}
function move_right(){
    if(editor().getDoc().somethingSelected()){
        var old_value = editor().getDoc().getSelection().split("\n");
        for(var i = 0; i < old_value.length; i++){
            old_value[i]="\t"+old_value[i];
        }
        var new_value = old_value.join("\n");
        editor().getDoc().replaceSelection(new_value);
    }
    else{
        document.querySelector("#toast-select").show();
    }
}
/*==============
BOTTOM
==============*/


/*============
LOREM
==============*/
var lorem_type = "s";
function generate(){
    $("#lorem").html("");
    var lorem = new Lorem;
    lorem.type = Lorem.TEXT;
    lorem.query = $("#lorem_input").val() + lorem_type;
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
	code_before_replace = code_before_replace.replace(re, 'repl.print');
	repl.eval(code_before_replace);
	
	show_side_terminal();
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
		if(editor().getDoc().somethingSelected()){
			editor().getDoc().replaceSelection(color);
		}
		else{
	  		var before = editor().getDoc().getCursor();
			editor().getDoc().replaceRange(""+color, before);
			var after = editor().getDoc().getCursor();
			editor().getDoc().setSelection(before, after);
  		}
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
       	var previewFrame = document.getElementById('preview');
		var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
		preview.open();
		var c = editor().getValue();
		if(editor().getOption("mode") === "text/x-markdown" || editor().getOption("mode") === "gfm"){
			c = converter.makeHtml(c);
		}
		preview.write(c);
		preview.close();
}
/*=========
SCREEN
==========*/
function lift_screen(){
	if(window.location.href.indexOf("?lift=no") === -1){
		if(!is_mobile){
			$("#screen").animate({
				marginTop: "-100%",
				marginBottom: "100%"
			},750,function(){
				$("#screen").remove();
			});
		}
		else{
			$("#screen").fadeOut("slow",function(){
				$("#screen").remove();
			});
		}
	}
}

