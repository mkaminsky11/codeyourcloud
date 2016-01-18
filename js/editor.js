var manager = {};
manager.allSaved = function(){
	for(var i = 0; i < editors.length; i++){
		if(editors[i].saved === false){
			return false;
		}
	}
	return true;
}
manager.isOpen = function(id){
	var found = false;
	for(var i = 0; i < editors.length; i++){
    	if(editors[i].id === id){
    	  found = true; 
    	}
  	}
  	return found;
}
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
		var content = charToCode(getEditor(id).getValue());
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
	if(editors[getIndex(id)].saved === false){
		if (confirm('You have unsaved work. Do you really want to close this file?')) {
		    manager.reallyRemove(id);
		} else {
		}
	}
	else{
		manager.reallyRemove(id);
	}
}
manager.reallyRemove = function(id){
	hide_loading_spinner();	//nothing should be loading anymore
	$("#overlay").css("display","block");
	//remove the tab div with style!
	$(".tab-tab[data-fileid='"+id+"']").velocity("transition.slideUpOut",{
		duration: 400,
		drag: true,
		complete: function(){
			$(".tab-tab[data-fileid='"+id+"']").remove();
		}
	});
	$(".codemirror-container[data-fileid='"+id+"']").remove();
	var index = -1;
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			index = i;
		}
	}
	current_file = "";
	if(id !== "welcome"){
		if(settings.state.tabs.indexOf(id) !== -1){
			settings.state.tabs.splice(settings.state.tabs.indexOf(id), 1);
			settings.change();
		}
	}
	editors.splice(index,1);
}

manager.openTab = function(id){
	$("#overlay").css("display","none");
	//remove .active from the current .active tab
	$(".tab-active").removeClass("tab-active");
	$(".tab-tab[data-fileid='"+id+"']").addClass("tab-active");
	//remove .active from the current .active edtiro
	$(".codemirror-active").css("display","none");
	$(".codemirror-active").removeClass("codemirror-active");
	//add .active to the editor to be opened
	$(".codemirror-container[data-fileid='"+id+"']").css("display","block");
	$(".codemirror-container[data-fileid='"+id+"']").addClass("codemirror-active");
	//same with chats
	$(".chats-active").css("display","none");
	$(".chats-active-people").css("display","none");
	$(".chats-active").removeClass("chats-active");
	$(".chats-active-people").removeClass("chats-active-people");
	$(".chats-content[data-fileid='"+id+"']").css("display","block");
	$(".chats-people[data-fileid='"+id+"']").css("display","block");
	$(".chats-content[data-fileid='"+id+"']").addClass("chats-active");
	$(".chats-people[data-fileid='"+id+"']").addClass("chats-active-people");
  
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
	editors[getIndex(id)].saved = state;
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

/*
REVISED MODE CHANGE:
* check if mode is loaded
* if it is, set it
	- if not, load via ajax with onload = actuallySetMode(...)
	- if successful
		* check if editor still exists, set if it does
		* add mode to list of loaded modes
	
*/

manager.setMode = function(id,mode){
	var res = _mode.modeLoaded(mode);
	if(res[0] === true){
		console.log("mode loaded...setting");
		manager.actuallySetMode(id,mode);
	}
	else{
		console.log("mode not loaded...now loading");
		if(res[1] !== null){
			_mode.loadMode(res[1], mode, id, function(the_id, the_mode){
				manager.actuallySetMode(the_id, the_mode);
			});
		}
		else{
			//the mode does not exist
		}
	}
};

manager.actuallySetMode = function(id, mode){
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

manager.publish = function(){
	connect.publish(editor().getValue(), editor().getOption("mode"), current_file, function(data){
			
	});
}

function modeChange(){
	manager.setMode(current_file,$("#mode-select").val());
}
//populates the mode select
for(var i = 0; i < modes.length; i++){
	modeSelect = modeSelect + "<option value='"+modes[i].mime+"'>"+modes[i].name+"</option>";
	$("#mode-select").html(modeSelect);
}

function editorUndo() {
	editor().getDoc().undo();
}
function editorRedo() {
	editor().getDoc().redo();
}

//populates theme select
for(var j = 0; j < themes.length; j++){	
	$("#theme-select").html($("#theme-select").html() + "<option value='"+themes[j].split(" ").join("-").toLowerCase()+"'>"+themes[j]+"</option>");
}

//populates the font select
for(var k = 2; k <= 30; k++){
	$("#font-select").html($("#font-select").html() + "<option value='" + k + "'>" + k + "px</option>");
}

//sets default settings
$("#mode-select").val("text/plain");
$("#theme-select").val("monokai");
$("#font-select").val("12");
$("#indent-size-select").val("4");

/**
* OPTIONS
* line numbers, line wrap, font size
**/

var settings = {};

settings.lineNumbersChange = function(){
  settings.lineNumbers();
  settings.change();
};

settings.lineNumbers = function(){
	this.state.lineNumbers = !this.state.lineNumbers;
	for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("lineNumbers", this.state.lineNumbers);
	}
}

settings.lineWrapChange = function(){
  settings.lineWrap();
  settings.change();
};

settings.lineWrap = function(){
	this.state.lineWrap = !this.state.lineWrap;
	for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("lineWrapping", this.state.lineWrap);
	}	
}

settings.minimapChange = function(){
  settings.minimap();
  settings.change();
}

settings.minimap = function(){
	this.state.minimap = !this.state.minimap;
	for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("minimap", this.state.minimap);
	}
}

settings.theme = function(theme){
	for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("theme",theme);
	}
	for(var i = 0; i < snippets.data.length; i++){
		snippets.data[i].editor.setOption("theme",theme);
	}
	this.state.theme = theme;
}

settings.themeChange = function(){
	settings.theme($("#theme-select").val());
	settings.change();
}

settings.fontChange = function(){
	settings.font(parseInt($("#font-select").val()));
	settings.change();
}

settings.font = function(size){
	this.state.fontSize = size;
	$(".CodeMirror").css("fontSize", size +"px");
}

settings.indentUnitChange = function(){
  settings.indentUnit(parseInt($("#indent-size-select").val()));
  settings.change();
}

settings.indentUnit = function(size){
  for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("indentUnit",size);
	}
	for(var i = 0; i < snippets.data.length; i++){
		snippets.data[i].editor.setOption("indentUnit",size);
	}
  this.state.indentUnit = size;
}

settings.tabSizeChange = function(){
  settings.tabSize(parseInt($("#tab-size-select").val()));
  settings.change();
}

settings.tabSize = function(size){
  for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("tabSize",size);
	}
	for(var i = 0; i < snippets.data.length; i++){
		snippets.data[i].editor.setOption("tabSize",size);
	}
  this.state.tabSize = size; 
}

settings.indentWithTabsChange = function(){
  settings.indentWithTabs();
  settings.change();
}

settings.indentWithTabs = function(){
	this.state.indentWithTabs = !this.state.indentWithTabs;
	for(var i = 0; i < editors.length; i++){
		editors[i].editor.setOption("indentWithTabs", this.state.indentWithTabs);
	}
	for(var i = 0; i < snippets.data.length; i++){
		snippets.data[i].editor.setOption("indentWithTabs",this.state.indentWithTabs);
	}
}

settings.init = function(){
  connect.settings.getSettings(function(prefs){
    //theme
    $("#theme-select").val(prefs.theme);
    settings.theme(prefs.theme);
    //font
    $("#font-select").val(prefs.fontSize);
    settings.font(prefs.fontSize);
    //
    $("#tab-size-select").val(prefs.tabSize);
    settings.tabSize(prefs.tabSize);
    //
    $("#indent-size-select").val(prefs.indentUnit);
    settings.indentUnit(prefs.indentUnit);
    //
    if(prefs.indentWithTabs !== settings.state.indentWithTabs){
      $("#side-indent-tabs").prop("checked", !$("#side-indent-tabs").prop("checked"));
    }
    //
    if(prefs.minimap !== settings.state.minimap){
      $("#side-minimap").prop("checked", !$("#side-minimap").prop("checked"));
    }
    //
    if(prefs.lineNumbers !== settings.state.lineNumbers){
      $("#side-nums").prop("checked", !$("#side-nums").prop("checked"));
    }
    //
    if(prefs.lineWrap !== settings.state.lineWrap){
      $("#side-wrap").prop("checked", !$("#side-wrap").prop("checked"));
    }
    //
    //
    settings.state = prefs;
    
    settings.state.tabs = [];
    for(var i = 0; i < prefs.tabs.length; i++){
	    if(prefs.tabs[i].indexOf(cloud_use + "_") === 0){
		    settings.state.tabs.push(prefs.tabs[i].replace(cloud_use + "_"));
	    }
    }
    
    for(var i = 0; i < settings.state.tabs.length; i++){
	    if(manager.isOpen(settings.state.tabs[i]) === false){
		    addTab(settings.state.tabs[i], false);
	    }
    }
  });    
}

settings.change = function(){
	var info = settings.state;
	for(var i = 0; i < info.tabs.length; i++){
		info.tabs[i] = cloud_use + "_" + info.tabs[i];
	}
  $.ajax("https://codeyourcloud.com/prefs/change",{
		method: "POST",
		data: info,
		success: function(data, textStatus, jqXHR){
		},
		error: function(jqXHR, textStatus, errorThrown){
			throw errorThrown;
		}
	});
}

settings.state = {
	lineNumbers: true,
	lineWrap: true,
	minimap: false,
	fontSize: 12,
	theme: "monokai",
	indentUnit: 4,
	indentWithTabs: true,
	tabSize: 4,
	tabs: []
};

/**
* HINTS
* hints and autocomplete
**/
function getHint(){
	switch(editor().getOption("mode")){
		case "text/javascript":
			server.updateArgHints(editor());
		case "text/css":
			CodeMirror.showHint(editor(), CodeMirror.hint.css);
		case "text/html":
			CodeMirror.showHint(editor(), CodeMirror.hint.html);
		case "text/x-python":
			CodeMirror.showHint(editor(), CodeMirror.hint.python);
		case "text/x-sql":
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
