/**
* FIND/REPLACE
* find and replace for editors
**/

var manager = {};


manager.trash = function(id){
	if(id !== "welcome"){
		if(cloud_use === "drive"){
			drive.trash(id);
		}
		else if(cloud_use === "sky"){
			sky.trash(id);
		}
	}
}
manager.renameId = null;
manager.rename = function(current_title, id){
  manager.renameId = id;
  editor().openDialog('Rename: <input type="text" style="width: 10em" class="CodeMirror-search-field" value="'+current_title+'"/>', function(new_title){
    manager.setFileTitle(manager.renameId, new_title);
    if(cloud_use === "drive"){
      sendData({
        type: "title",
        title: new_title
      }, manager.renameId);
    }
    else if(cloud_use === "sky"){
      sky.renameFile(manager.renameId, new_title);
    }
  }, {});
}
manager.currentRename = function(){
  manager.rename(title(), current_file);
}
manager.setFileTitle = function(id, title){
	editors[getIndex(id)].title = title;
	$(".tab-tab[data-fileid='"+id+"']").find("h4").html(title);
	manager.checkMode(id, title);
	var index = getIndex(id);
	var ext = manager.extension(title.toLowerCase());
	//change the title in the tree view
	var inner_html = $("[data-tree-li='"+id+"'] span").html().split(">");
	inner_html[2] = title;
	$("[data-tree-li='"+id+"'] span").html(inner_html.join(">"));
	$(".tab-tab[data-fileid='"+id+"'] > i").replaceWith(tree.getIconByTitle(title));
	$(".tab-tab[data-fileid='"+id+"']").attr("data-icon", tree.getClassFromIcon(tree.getIconByTitle(title)));
}

manager.save = function(id){
	if(id !== "welcome"){
		var content = getEditor(id).getValue()
		if(typeof content !== "undefined"){ //if nothing is "null"
			if(cloud_use === "drive"){
		        var contentArray = new Array(content.length);
		        for (var i = 0; i < contentArray.length; i++) {
		            contentArray[i] = content.charCodeAt(i);
		        }
		        var byteArray = new Uint8Array(contentArray);
		        var blob = new Blob([byteArray], {type: 'text/plain'});
		        var request = gapi.client.drive.files.get({'fileId': id});
		        //gets the metadata, which is left alone
		        request.execute(function(resp) {
		            drive.updateFile(id,resp,blob, function(resp){
			            manager.setSaveState(resp.id, true)
			        });
		        });
		    }
		    else if(cloud_use === "sky"){
			    sky.updateFile(id, content, function(resp){
				    console.log(resp);
			    });
		    }
	    }
	}
}

manager.removeTab = function(id){
	hide_loading_spinner();	//nothing should be loading anymore
	//remove the tab div with style!
	$(".tab-tab[data-fileid='"+id+"']").velocity("transition.slideUpOut",{
		duration: 400,
		drag: true,
		complete: function(){
			$(".tab-tab[data-fileid='"+id+"']").remove();
		}
	});
	$(".codemirror-container[data-fileid='"+id+"']").remove();
	$(".users-container[data-fileid='"+id+"']").remove();
  
	var index = -1;
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			index = i;
		}
	}

	current_file = "";
	editors.splice(index,1);
}

manager.openTab = function(id){
	//remove .active from the current .active tab
	$(".tab-active").removeClass("tab-active");
	$(".tab-tab[data-fileid='"+id+"']").addClass("tab-active");
	//remove .active from the current .active edtiro
	$(".codemirror-active").css("display","none");
	$(".codemirror-active").removeClass("codemirror-active");
	//add .active to the editor to be opened
	$(".codemirror-container[data-fileid='"+id+"']").css("display","block");
	$(".codemirror-container[data-fileid='"+id+"']").addClass("codemirror-active");
	//remove .active from the current .active users container
	$(".users-container-active").css("display","none");
	$(".users-container-active").removeClass("users-container-active");
	//add .active
	$(".users-container[data-fileid='"+id+"']").css("display","block");
	$(".users-container[data-fileid='"+id+"']").addClass("users-container-active");
	//same with chats
	$(".chats-active").css("display","none");
	$(".chats-active").removeClass("chats-active");
	$(".chats-content[data-fileid='"+id+"']").css("display","block");
	$(".chats-content[data-fileid='"+id+"']").addClass("chats-active");
  
	$(".CodeMirror").css("font-size","12px");
	current_file = id;
  
	try{
		editor().refresh(); 
	}
	catch(e){
		//otherwise, a file isn't open
		//set everything to the default
	}
	adjust();
}

manager.setSaveState = function(id, state){
	if(state === false){
		$(".tab-tab[data-fileid='"+id+"'] > i").replaceWith("<i class=\"fa fa-circle\" style=\"color:#FF9000\"></i>");
	}
	else{
		$(".tab-tab[data-fileid='"+id+"'] > i").replaceWith($(".tab-tab[data-fileid='"+id+"']").attr("data-icon"));
	}
}

function find(){
	CodeMirror.commands["findNext"](editor());
}

function replace(){
	CodeMirror.commands["replace"](editor());
}


manager.setMode = function(id,mode){
	try{
		if(mode !== $("#mode-select").val()){
			$("#mode-select").val(mode);
		}
	}
	catch(e){}
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
	adjust();
}

manager.extension = function(fileName){
	var ext = "txt";
	var hidden = false;
	if(fileName.charAt(0) === "."){hidden = true;} 
	else{ext = fileName.split(".").reverse()[0]}
	return {ext: ext, hidden: hidden}; //hidden like .DS_STORE or .vimrc
}

manager.checkMode = function(id, fileName){
	var ext_info = manager.extension(fileName);
	var mode_to_use = "text"; //default
	if(ext_info.hidden === false){
		for(var i = 0; i < modes.length; i++){
			var possible_mime = modes[i].mime;
			var exts = modes[i].ext;
			if((exts && exts.indexOf(ext_info.ext) !== -1) || (modes[i].alias && modes[i].alias.indexOf(ext_info.ext) !== -1)){
				mode_to_use = possible_mime;
			}
		}
	}
	manager.setMode(id,mode_to_use);
}

function modeChange(){
	manager.setMode(current_file,$("#mode-select").val());
}
//populates the mode select
for(var i = 0; i < modes.length; i++){
	$("#mode-select").html($("#mode-select").html() + "<option value='"+modes[i].mime+"'>"+modes[i].name+"</option>");
}

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
function toggleMinimap(){
	minimap = !minimap;
	for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("minimap", minimap);
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