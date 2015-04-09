/*===
* CODEYOURCLOUD
*
* tabs.js built by Michael Kaminsky
* manages the tabs and their editors
*
* contents:
*  editors
*  communications
*  tabs
===*/

//returns the editor currently shown
function editor(){
	for(var i = 0; i < editors.length; i++){
  if(editors[i].id === current_file){
    return editors[i].editor;
  }
 }
}
//adds and editor
function add_editor(e, id, welcome){
	var to_push = {
    	editor: e,
    	id: id,
    	welcome: welcome,
    	title: "",
    	ignore: false
	};
  
	editors.push(to_push);
	current_file = id;
	e.refresh();
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
//sets the title (duh)
function setFileTitle(id, title){
	//first, set the h4 of the .tab-tab
	editors[getIndex(id)].title = title;
	$(".tab-tab[data-fileid='"+id+"']").find("h4").html(title);
	//since the default is "loading"
	//changes the mode in case the extension was changed
	check_mode(id, title);
	var index = getIndex(id);
	if(current_file === id){ //if this is the file being show, you should change the title input
		$("#title").val(editors[index].title);
	}
	var ext = extension(title.toLowerCase());
	if(ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "gif" || ext === "tif"){ //if it is now an image
		editors[index].image = true; //yes, it is in fact an image
		if(current_file === id){ //if if is the one being displayed
			read_image(id); //display it as an image
		}
	}
	
	//change the title in the tree view
	var j = $("[data-tree-li='"+id+"'] span").html().split(">");
	j[2] = title;
	$("[data-tree-li='"+id+"'] span").html(j.join(">"));
	$(".tab-tab[data-fileid='"+id+"'] > i").replaceWith(getIconByTitle(title));
}

/**
* COMMUNICATIONS
* allows for communication between the iframes that keep track of the individual files and the main IDE
**/

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){
  if(event.data !== "!_{h:''}"){
  	var json = JSON.parse(event.data);
  	if(typeof json.s === 'undefined'){ //this makes sure that only the intended messages are getting in. There are some "background" ones
	  	var id = json.currentfile; //which file is this referring to?
	  	
	  	if(json.type === "text"){ //sets the text
		  	getEditor(id).setValue(json.value);
		  	hide_loading_spinner();
	  	}
	  	else if(json.type === "title"){ //sets the title
		  	setFileTitle(id, json.title);
		}
	  	else if(json.type === "saved"){ //it has been saved
		  	//TODO: send a message to user
	  	}
	  	else if(json.type === "insert_text"){ //text has been inserted
	  		setIgnore(id, true); //ignore the second one (realtime problems)
		  	getEditor(id).replaceRange(json.text, getEditor(id).posFromIndex(json.point)); //implement change
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
		  	insertUser(json.name, json.color, temp_photo, json.session, json.currentfile);
	  	}
	  	else if(json.type === "delete_user"){ //a user left
		  	removeUser(json.id, json.currentfile);
	  	}
	  	else if(json.type === "insert_chat"){ //a chat message was recieved
		  	var temp_photo = json.photo;
	  		if(temp_photo.indexOf("https://") === -1){
		  		temp_photo = "https:" + temp_photo;
	  		}
	  		insert_chat(json.message, json.you, temp_photo, json.name, json.currentfile);
	  	}
  	}
  }
}
//allows data to be sent to an iframe
function sendData(data, fileid){
	document.getElementById("iframe-" + fileid).contentWindow.postMessage(JSON.stringify(data), "*");
}

/**
* TABS
* manages the tabs themselves
**/

//adds a new tab
function addTab(title, id, welcome){
  if(title === "loading..."){ //this will only be true if the editor is now the welcome tab
	show_loading_spinner();
  }

  //check to see if it already exists
  //don't want to make a copy
  var found = false;
  for(var i = 0; i < editors.length; i++){
    if(editors[i].id === id){
      found = true; 
    }
  }
  
  if(found){
    //already there, open it
    opentab(id);
  }
  else{
	//add a new tab
    var base = "<span class='tab-tab' data-fileid='"+id+"' onclick='opentab(\""+id+"\")'>" + getIconByTitle(title) + "<h4>" + title + "</h4>";
    base = base + "<h6><i class='md-close' onclick='removetab(\""+id+"\")' style='float:right'></i></h6>";
    base = base + "</span>";
    $(".tab-container").html($(".tab-container").html() + base);
    
    //add a new codemirror
    var codemirror = "<div class='codemirror-container' id='"+id+"' data-fileid='"+id+"' style='display:none'><iframe src='https://codeyourcloud.com/js/logic/logic.html?id="+id+"' style='display:none' id='iframe-"+id+"'></iframe></div>";
    $("#insert-point").after(codemirror);
    var chat = "<div class='chats-content' data-fileid='"+id+"' style='display:none'></div>";
    
    //add a div to store the chat messages in each of the locations (there may be multiple)
    $(".chats-store").each(function(index){
	    $(this).html(chat + $(this).html());
	 });
    
    //add a new div to store user pictures
	var user = "<div class='users-container' data-fileid='"+id+"' style='display:none'></div>";
	$("#users").html($("#users").html() + user);
	
	//actually create the new editor
    var e = CodeMirror(document.getElementById(id),{
         lineNumbers: true,
         mode: "text",
         theme: editor_theme,
         lineWrapping: true, 
         indentUnit: 4, 
         indentWithTabs: true
    });
    e.id = id;

	//add the editor to "editors"
    add_editor(e, id, welcome);
    current_file = id; //open it up
    //configure the editor
    editor().on("beforeSelectionChange", function(cm, selection){
      set_color(editor().getSelection());	
    });
    editor().setOption("autoCloseBrackets",true);
    editor().setOption("matchBrackets",true);
    editor().on("change", function(cm, change) {
    	if(!getIgnore(cm.id)){ //if this input is not to be ignored...
	    	sendData({
		    	type: "text",
		    	text: cm.getValue()
	    	},cm.id);
    	
    	}
    	else{
	    	setIgnore(cm.id, false);
    	}
    	window.setTimeout(function(){ //update minimap
	    	mini.mini();
    	}, 200);
    });
    editor().setOption("lineNumbers",line_wrap);
    editor().setOption("lineWrapping",line_number);
    opentab(id);
    $(".CodeMirror-scroll").scroll(function(){
	   mini.view();
	});
  }
  
}
//open a tab
function opentab(id){
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
  
	//TODO: fix this
	$(".CodeMirror").css("font-size","12px");
	current_file = id;
  
	try{
		editor().refresh(); //try to refresh it
	}
	catch(e){
		//otherwise, a file isn't open
		//set everything to the default
		$("#title").val("Code Your Cloud");
		$("#rename-toggle").css("display","none");
		$("#rename_input").val("");
	}
	
	//adjust things here
	var index = getIndex(id);
	if(editors[index].welcome){
		//default
		$("#title").val("Code Your Cloud");
		$("#rename-toggle").css("display","none");
		$("#rename_input").val("");
	}
	else{
		//a file
		$("#title").val(editors[index].title);
		$("#rename-toggle").css("display","inline-block");
		$("#rename_input").val(editors[index].title);
	}
	if(editors[index].image){
		read_image(id);	
	}
	else{
		$("#image_div").css("display","none");
	}
	adjust(); //adjust again
	mini.mini(); //refresh minimap
	mini.view(); //adjust the scrolling of the minimap
}

//remove a tab
function removetab(id){
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
//adjust based on the file
function adjust(){
	var id = current_file;
	if(id === "welcome"){ //default
		$(".side-file").css("display","none"); //nothing file-specific should be shown
		$("#chat-popup").slideUp(); //can't chat in the welcome message
	}
	else{	
			$(".side-file").css("display","inline-block");
	}
	var mode = editor().getOption("mode");
	try{	
		if(mode !== mode_select.value){
			mode_select.change(mode);
		}
	}
	catch(e){}
	
	//by default..
	$(".side-run").addClass("hide"); //can't run anything
	$(".side-pub").addClass("hide"); //can't publish anything
	
	//set publish link
	$("#side-pub-link").attr("href","https://codeyourcloud.com/pub/" + userId + "/index.html"); 
	
	//language specific stuff
	if(mode === "text/javascript"){
		$(".side-run").removeClass("hide"); //can run javascript
	}
	else if(mode === "text/x-coffeescript"){
		$(".side-run").removeClass("hide"); //can run coffeescript
	}
	else if(mode === "text/html"){
		$(".side-pub").removeClass("hide"); //can publish html
	}
	else if(mode === "text/x-latex" || mode === "text/x-stex"){
		$(".side-pub").removeClass("hide");
		$("#side-pub-link").attr("href","https://codeyourcloud.com/pub/" + userId + "/" + current_file + ".pdf");
	}
	else if(mode === "text/x-markdown" || mode === "gfm" || mode === "markdown"){
		$(".side-pub").removeClass("hide"); //can publish markdown
	}
	//else if(mode === "text/x-python" || mode === "text/x-lua" || mode === "text/x-scheme"){
	//	$(".side-pub").removeClass("hide");
	//}
}
//insert a chat message
function insert_chat(message, you, photo, name, fileid){
	if(message.trim() !== ""){
	  var push = "<div class=\"chat-item\">";
	  push = push + "<img height=\"30px\" width=\"30px\" src=\""+ photo +"\">";
	  push = push + "<div><h3>"+name+"</h3><pre>";
	  push = push + message + "</pre></div></div>";
	  $(".chats-content[data-fileid='"+fileid+"']").html($(".chats-content[data-fileid='"+fileid+"']").html() + push);
	  
	  $(".chats-content[data-fileid='"+fileid+"']").animate({ scrollTop: $(".chats-content[data-fileid='"+fileid+"']")[0].scrollHeight}, 500);
	}
}
//send a chat message
function sendChat(){
	var message = $(".chat-input").val();
	sendData({
		type: "newchat",
		message: message,
		name: userName,
		id: userId,
		photo: userUrl
	}, current_file);
	
	$(".chat-input").val("");
}
