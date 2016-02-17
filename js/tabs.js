//returns the editor currently shown
function editor(){
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === current_file){
			return editors[i].editor;
  		}
	}
}
function title(){
  return editors[getIndex(current_file)].title; 
}
function addEditor(e, id, welcome){
	var to_push = {
    		editor: e,
    		id: id,
    		welcome: welcome,
    		title: "",
    		ignore: false, //should the next change be ignored (prevent change loop)
    		saved: true
	};
  
	editors.push(to_push);
	current_file = id;
	e.refresh();
	$("#overlay").css("display","none")
}
//gets an editor by its file id
function getEditor(id){
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			return editors[i].editor;
		}
	}
}
//gets the index of and editor in "editors" based on its fileid
function getIndex(id){
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			return i;
		}
	}
}
//gets if it is set to ignore the next input
//this is needed because any changes will be registered by the realtime api, then sent back
//if this was not in place, every change would be registered twice
function getIgnore(id){
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			return editors[i].ignore;
		}
	}
}
function setIgnore(id, ignore){
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			editors[i].ignore = ignore;
		}
	}
}


window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){
  if(event.data !== "!_{h:''}"){
  	var json = JSON.parse(event.data);
  	if(typeof json.s === 'undefined'){ //this makes sure that only the intended messages are getting in. There are some "background" ones
	  	var id = json.currentfile;
	  	if(json.type === "text"){
		  	getEditor(id).setValue(decode_utf8(json.value));
		  	editors[getIndex(id)].saved = true;
		  	hide_loading_spinner();
	  	}
	  	else if(json.type === "title"){ 
		  	manager.setFileTitle(id, json.title);
		}
	  	else if(json.type === "insert_text"){ //text has been inserted
	  		setIgnore(id, true); //ignore the second one (realtime problems)
		  	getEditor(id).replaceRange(decode_utf8(json.text), getEditor(id).posFromIndex(json.point)); //implement change
		}
	  	else if(json.type === "delete_text"){ //same as above, just delete
	  		setIgnore(id, true);
	  		getEditor(id).replaceRange("",getEditor(id).posFromIndex(json.back),getEditor(id).posFromIndex(json.front));
	  	}
	  	else if(json.type === "insert_user"){ //a new user joined this file
	  		var temp_photo = json.photo; //insert his picture
	  		if(temp_photo.indexOf("https://") === -1){ //sometimes comes back as //blah.com/example.png
		  		temp_photo = "https:" + temp_photo;
	  		}
	  		connect.chat.insertUser(json, temp_photo);
	  	}
	  	else if(json.type === "delete_user"){ //a user left
	  		connect.chat.removeUser(json);
	  	}
	  	else if(json.type === "insert_chat"){ //a chat message was recieved
		  	var temp_photo = json.photo;
	  		if(temp_photo.indexOf("https://") === -1){
		  		temp_photo = "https:" + temp_photo;
	  		}
	  		insertChat(json.message, json.you, temp_photo, json.name, json.currentfile, json.is_new);
	  	}
  	}
  }
}
//allows data to be sent to an iframe
function sendData(data, fileid){
	document.getElementById("iframe-" + fileid).contentWindow.postMessage(JSON.stringify(data), "*");
}

function addTab(id, welcome){
  show_loading_spinner();
  //check to see if it already exists
  //don't want to make a copy
  var found = manager.isOpen(id);
  if(found){
    manager.openTab(id);
  }
  else{
	//add a tab
	if(id !== "welcome" && settings.state.tabs.indexOf(cloud_use + "_" + id) === -1){
		settings.state.tabs.push(cloud_use + "_" + id);
		settings.change();	
	}
	
    var base = "<span class='tab-tab' data-fileid='"+id+"'><i class=\"fa fa-align-left\"></i><h4 onclick='manager.openTab(\""+id+"\")'>loading...</h4>";
    base = base + "<h6><span class='context-click' data-fileid='"+id+"'><i class='zmdi zmdi-caret-down'></i></span><i class='zmdi zmdi-close' onclick='manager.removeTab(\""+id+"\")'></i></h6><span>";
    $(".tab-container").html($(".tab-container").html() + base);
    var codemirror = "<div class='codemirror-container' id='"+id+"' data-fileid='"+id+"' style='display:none'><iframe src='https://codeyourcloud.com/js/logic/logic.html?id="+id+"' style='display:none' id='iframe-"+id+"'></iframe></div>"; 
    if(cloud_use === "sky"){
	        codemirror = "<div class='codemirror-container' id='"+id+"' data-fileid='"+id+"' style='display:none'></div>";
    }
    $("#insert-point").after(codemirror);
    $(".tab-tab[data-fileid='"+id+"']").attr("data-icon", tree.getClassFromIcon('<i class="fa fa-align-left"></i>'));
    
    var chat = "<div class='chats-content' data-fileid='"+id+"' style='display:none'></div>";
    var _chat = "<div class='chats-people' data-fileid='"+id+"' style='display:none'></div>";
    $(".chats-users").append(_chat);
    if(cloud_use === "sky"){chat = ""}
    $(".chats-store").each(function(index){
	    $(this).html(chat + $(this).html());
	 });
	//actually create the new editor
    var e = CodeMirror(document.getElementById(id),{
        lineNumbers: settings.state.lineNumbers,
        mode: "text",
        theme: settings.state.theme,
        lineWrapping: settings.state.lineWrap, 
        indentUnit: 4,
        indentWithTabs: true,
        tabSize: settings.state.tabSize,
        foldGutter: true,
		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
		minimap: settings.state.minimap,
		autoCloseBrackets: true,
		matchBrackets: true
    });
    e.id = id;

    addEditor(e, id, welcome);
    current_file = id;
    editor().on("beforeSelectionChange", function(cm, selection){
      set_color(editor().getSelection());	
    });
    editor().on("change", function(cm, change) {
	    manager.setSaveState(cm.id, false);
	    if(cloud_use === "drive"){
	    	if(!getIgnore(cm.id)){ //if this input is not to be ignored...
		    	sendData({
			    	type: "text",
			    	text: encode_utf8(cm.getValue())
		    	},cm.id);
	    	}
	    	else{
		    	setIgnore(cm.id, false);
	    	}
	    }
	    else if(cloud_use === "sky"){
		    
	    }
    });
    manager.openTab(id);
    $(".CodeMirror-scroll").scroll(function(){
	});
	
	if(cloud_use === "sky"){
		sky.getFile(id, function(data){
			hide_loading_spinner();
			manager.setFileTitle(id, data.name);
		});
		sky.getContentOfFile(id, function(res){
			getEditor(id).setValue(res);
		});
	}
  }
}

//adjust based on the file
function adjust(){
	var id = current_file;
	if(id === "welcome"){ //default
		$(".side-file").css("display","none"); //nothing file-specific should be shown
		$("#chat-popup").slideUp(); //can't chat in the welcome message
		$("#share-button").css("display","none");
	}
	else{	
			$(".side-file").css("display","inline-block");
			$("#share-button").css("display","inline-block");
	}
	var mode = editor().getOption("mode");
	try{	
		if(mode !== mode_select.value){
			mode_select.change(mode);
		}
	}
	catch(e){}
	
	$(".side-run").css("display","none"); //can't run anything
	$(".side-pub").css("display","none"); //can't publish anything
	
	//set publish link
	$(".side-pub-link").attr("href","https://codeyourcloud.com/pub/" + true_id + "/" + id.replace("-","") + ".html"); 
	if(cloud_use === "drive"){
		$(".side-drive-link").attr("href","https://drive.google.com/file/d/" + current_file + "/view?usp=drivesdk");
	}
	
	if(mode === "text/javascript"){
		$(".side-run").css("display","inline-block"); //can run javascript
	}
	else if(mode === "text/x-coffeescript"){
		$(".side-run").css("display","inline-block"); //can run coffeescript
	}
	else if(mode === "text/html"){
		$(".side-pub").css("display","inline-block");; //can publish html
	}
	else if(mode === "text/x-latex" || mode === "text/x-stex"){
		$(".side-pub").css("display","inline-block");;
		$(".side-pub-link").attr("href","https://codeyourcloud.com/pub/" + true_id + "/" + id.replace("-","") + ".pdf"); 
	}
	else if(mode === "text/x-markdown" || mode === "gfm" || mode === "markdown"){
		$(".side-pub").css("display","inline-block"); //can publish markdown
	}
	editor().setOption("gutters", ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
}
//insert a chat message
function insertChat(message, you, photo, name, fileid, is_new){
	if(message.trim() !== ""){
		var push = "<div class=\"chat-item\">";
		push = push + "<img height=\"30px\" width=\"30px\" src=\""+ photo +"\">";
		push = push + "<div><h3>"+name+"</h3><pre>";
		push = push + message + "</pre></div></div>";
		$(".chats-content[data-fileid='"+fileid+"']").html($(".chats-content[data-fileid='"+fileid+"']").html() + push);
		$(".chats-content[data-fileid='"+fileid+"']").animate({ scrollTop: $(".chats-content[data-fileid='"+fileid+"']")[0].scrollHeight}, 500);

		if(you === false && is_new === true){
			if($("#help_button span").css("display") === "none"){
				//not opened
				var _curr = parseInt($("#help_button span").html());
			}
		}
	}
}
//send a chat message
function sendChat(){
	var message = $(".chat-input").val();
	sendData({
		type: "newchat",
		message: message,
		name: drive.username,
		id: drive.id,
		photo: drive.url
	}, current_file);
	
	$(".chat-input").val("");
}
