function switch_col(){
	if(chat_open){
		closeChat();
	}
	else{
		showChat();
	}
}
function sendMessage(message, type){
    Messenger().post({message:message,showCloseButton: true, hideAfter: 5, type: type});
}
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
	CodeMirror.commands["findNext"](editor);
}
function replace(){
	CodeMirror.commands["replace"](editor);
}
function setMode(mode){
	//defaults
	$(".side-run").addClass("hide");
	$(".side-pub").addClass("hide");
	//$("#side-auto").addClass("hide");
	
	editor.setOption("extraKeys", {});
	editor.setOption("gutters",["CodeMirror-linenumbers"]);
	editor.setOption("lint",false);
	//if javascript
	
	if(mode === "text/javascript"){
		$(".side-run").removeClass("hide");
		//$("#side-auto").removeClass("hide");
		editor.setOption("gutters",["CodeMirror-lint-markers"]);
		editor.setOption("lint",CodeMirror.lint.javascript);
		startTern();
	}
	
	else if(mode === "text/html"){
		//$("#side-auto").removeClass("hide");
		$(".side-pub").removeClass("hide");
		startHtml();
	}
	
	else if(mode === "text/css"){
		//$("#side-auto").removeClass("hide");
		editor.setOption("gutters",["CodeMirror-lint-markers"]);
		editor.setOption("lint",CodeMirror.lint.css);
		startCss();
	}
	
	else if(mode === "application/json"){
		//$("#side-auto").removeClass("hide");
		editor.setOption("gutters",["CodeMirror-lint-markers"]);
		editor.setOption("lint",CodeMirror.lint.json);
	}
	
	else if(mode === "text/x-python"){
		//$("#side-auto").removeClass("hide");
		startPython();
	}
	
	else if(mode === "text/x-sql"){
		//$("#side-auto").removeClass("hide");
		startSql();
	}
	
	editor.setOption("mode", mode);
}
function show_rename(){
	if(!is_welcome){
		$("#renameModal").modal('show');
	}
}
function no_rename(){
	$("#rename_input").val(title.getText());
	$("#renameModal").modal('hide');
}
function ok_rename(){
	title.setText($("#rename_input").val());
	renameFile(current, title.getText());
	$("#title").html(title.getText());
	check_mode(title.getText());
}
/*============
MODES
==============*/
function check_mode(fileName){
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
	
	setMode(mode_to_use);
}

for(var i = 0; i < modes.length; i++){
	var name = modes[i][0];
	var the_mode = modes[i][1];
	var elem = "<li class=\"list-group-item text-center mode-li\" onclick=\"setMode('"+ the_mode +"')\">"+ name +"</li>";
	$("#mode-ul").html($("#mode-ul").html() + elem);
}
function mode_search_change(){
	var search_term = $("#mode_input").val();
	$(".mode-li").each(function(index){
		if(search_term === ""){
			$(this).css("display","block");
		}
		else{
			var li_term = $(this).html();
			if(li_term.toLowerCase().indexOf(search_term.toLowerCase()) !== -1){
				$(this).css("display","block");
			}
			else{
				$(this).css("display","none");
			}
		}
	});
}

function theme_search_change(){
	var search_term = $("#theme_input").val();
	$(".theme-li").each(function(index){
		if(search_term === ""){
			$(this).css("display","block");
		}
		else{
			var li_term = $(this).html();
			if(li_term.toLowerCase().indexOf(search_term.toLowerCase()) !== -1){
				$(this).css("display","block");
			}
			else{
				$(this).css("display","none");
			}
		}
	});
}

$('#mode_input').keyup(function(e){
	mode_search_change();
});
$('#theme_input').keyup(function(e){
	theme_search_change();
});

function showMode(){
	$("#modeModal").modal('show');
}
/*===========
UNDO/REDO
===========*/
var numUndo = 0;
var numRedo = 0;
function editor_undo() {
	editor.getDoc().undo();
}
function editor_redo() {
	editor.getDoc().redo();
}

/*==========
THEMES
===========*/
function setTheme(theme){
	editor.setOption("theme",theme);
	
	theme_sql = theme;
	set_sql();
}
function showTheme(){
	$("#themeModal").modal('show');
}
for(var j = 0; j < themes.length; j++){
	var the_name = themes[j];
	var the_theme = the_name.split(" ").join("-").toLowerCase();
	var elem = "<li class=\"list-group-item text-center theme-li\" onclick=\"setTheme('"+ the_theme +"')\">"+ the_name +"</li>";
	$("#theme-ul").html($("#theme-ul").html() + elem);
}
/*===============
SWITCHES
===============*/
function line_number_switch() {
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
function line_wrap_switch() {
	if(editor.getOption("lineWrapping")){
		editor.setOption("lineWrapping",false);
		line_wrap = false;
	}	
	else{
		editor.setOption("lineWrapping",true);
		line_wrap = true;
	}
	set_sql();
}

function fontUp(){
	var old = Number($(".CodeMirror").css("fontSize").replace("px", ""));
	if(old < 100){
		old = old + 2;
	}
	$(".CodeMirror").css("fontSize", old+"px");
	$("#spinner-font").val(old);
	sql_font = old;
	set_sql();
}
function fontDown(){
	var old = Number($(".CodeMirror").css("fontSize").replace("px", ""));
	if(old > 4){
		old = old - 2;
	}
	$(".CodeMirror").css("fontSize", old+"px");
	$("#spinner-font").val(old);
	sql_font = old;
	set_sql();
}

/*=============
MOVE LEFT/RIGHT
==============*/
function move_left(){
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
function move_right(){
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
the_console = CodeMirror(document.getElementById("con"),{
    lineNumbers: true,
    mode: "text",
    theme: "cobalt",
    lineWrapping: true, 
    readOnly: true
});
the_console.setValue("/*welcome to the code your cloud console!*/");
the_console.refresh();

function run(){
	var code_before_replace = editor.getValue();
	var find = 'console.log';
	var re = new RegExp(find, 'g');
	code_before_replace = code_before_replace.replace(re, 'printToConsole');
	eval(code_before_replace);
}

function printToConsole(to_print){
	var old_text = the_console.getValue();
	var new_text = old_text + "\n" + to_print;
	the_console.setValue(new_text);
}

function clear_console(){
	the_console.setValue("");
}
/*===========
NOTEPAD
===========*/
var the_notepad = CodeMirror(document.getElementById("note_pad"),{
    mode: "text",
    theme: "neo",
    lineWrapping: true, 
});
the_notepad.refresh();
the_notepad.setValue("start typing...");
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
		if(editor.getDoc().somethingSelected()){
			editor.getDoc().replaceSelection(color);
		}
		else{
	  		var before = editor.getDoc().getCursor();
			editor.getDoc().replaceRange(""+color, before);
			var after = editor.getDoc().getCursor();
			editor.getDoc().setSelection(before, after);
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
/*========
HINTS
=========*/
function getHint(){
	if(editor.getOption("mode") === "text/javascript"){
		server.updateArgHints(editor);
	}
	else if(editor.getOption("mode") === "text/css"){
		CodeMirror.showHint(editor, CodeMirror.hint.css);
	}
	else if(editor.getOption("mode") === "text/html"){
		CodeMirror.showHint(editor, CodeMirror.hint.html);
	}
	else if(editor.getOption("mode") === "text/x-python"){
		CodeMirror.showHint(editor, CodeMirror.hint.python);
	}
	else if(editor.getOption("mode") === "text/x-sql"){
		CodeMirror.showHint(editor, CodeMirror.hint.sql);
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
/*========
NEW FILE
==========*/
function new_file(){
	window.location.href= "https://codeyourcloud.com?%22folderId%22:%22" +  myRootFolderId + "%22,%22action%22:%22create";
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
		preview.write(editor.getValue());
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

/*=======
oFFLINE
========*/
Offline.on("down", function(){
	$(".offline-ui-content").html("Reconnecting...");
	$(".offline-ui-retry").html("Retry");
});
Offline.on("up", function(){
	$(".offline-ui-content").html("Reconnected!");
	location.reload();
});

/*=======
TEMPLATE
========*/
function show_temp(){
	$("#tempModal").modal("show");
}


function set_t(the_url){
	var txtFile = new XMLHttpRequest();
	txtFile.open("GET", the_url, true);
	txtFile.onreadystatechange = function()
	{
		if (txtFile.readyState === 4) {  // document is ready to parse.
			if (txtFile.status === 200) {  // file is found
				var allText = txtFile.responseText; 
				if(allText.indexOf('pagespeed_no_defer') !== -1){
					var t = allText.split("\n");
					
					for(var i = 0; i < t.length; i++){
						var line = t[i];
						if(line.indexOf("pagespeed") !== -1){
							t[i] = line.replace('<script pagespeed_no_defer="">//<![CDATA[','');
							t[i + 1] = "";
							t[i + 2] = "";
						}
					}
					
					allText = t.join("\n");
				}
				editor.setValue(allText);
			}
		}
	}
	txtFile.send(null);
}

function t_search(term){
	$("#temp-holder .media").each(function(index){
		var temp_title = $(this).attr("temp-title").toLowerCase();
		var temp_term = term.toLowerCase();
		var temp_desc= $(this).attr("temp-desc").toLowerCase();
		var temp_tag = $(this).attr("temp-tag");
		
		var ok = false;
		if(temp_term.indexOf(temp_title) !== -1 || temp_title.indexOf(temp_term) !== -1){
			ok = true;
		}
		if(temp_term.indexOf(temp_desc) !== -1 || temp_desc.indexOf(temp_term) !== -1){
			ok = true;
		}
		if(temp_term.indexOf(temp_tag) !== -1 || temp_tag.indexOf(temp_term) !== -1){
			ok = true;
		}
		
		if(ok){
			$(this).removeClass("hide");
		}
		else{
			$(this).addClass("hide");
		}
	});
}

$(".tags span").each(function(index){
	$(this).hover(function(){
		$(this).removeClass("label-default");
		$(this).addClass("label-success")
	},function(){
		$(this).removeClass("label-success");
		$(this).addClass("label-default");
	});
	
	$(this).click(function(){
		$("#temp-input").val($(this).html());
		t_search($(this).html());
	});
});

$('#temp-input').keyup(function(e){
	t_search($("#temp-input").val());
});
