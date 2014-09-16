window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){
  if(event.data !== "!_{h:''}"){
  	var json = JSON.parse(event.data);
  	if(typeof json.s === 'undefined'){
		//this makes sure that only the intended messages are getting in. There are some "background" ones
	  	
	  	var id = json.currentfile;
	  	
	  	if(json.type === "text"){
		  	getEditor(id).setValue(json.value);
	  	}
	  	else if(json.type === "title"){
		  	setFileTitle(id, json.title);
	  	}
	  	else if(json.type === "saved"){
		  	
	  	}
	  	else if(json.type === "insert_text"){
	  		setIgnore(id, true);
	  		
		  	getEditor(id).replaceRange(json.text, getEditor(id).posFromIndex(json.point));
		}
	  	else if(json.type === "delete_text"){
	  		setIgnore(id, true);
	  		//deleted the text, but set an ignore
	  		getEditor(id).replaceRange("",getEditor(id).posFromIndex(json.back),getEditor(id).posFromIndex(json.front));
	  	}
	  	else if(json.type === "insert_user"){
	  		var temp_photo = json.photo;
	  		if(temp_photo.indexOf("https://") === -1){
		  		temp_photo = "https:" + temp_photo;
	  		}
	  		
		  	insertUser(json.name, json.color, temp_photo, json.session, json.currentfile);
	  	}
	  	else if(json.type === "delete_user"){
		  	removeUser(json.id, json.currentfile);
	  	}
	  	else if(json.type === "insert_chat"){
		  	var temp_photo = json.photo;
	  		if(temp_photo.indexOf("https://") === -1){
		  		temp_photo = "https:" + temp_photo;
	  		}
	  		
	  		//function insert_chat(message, you, photo, name, fileid){
	  		insert_chat(json.message, json.you, temp_photo, json.name, json.currentfile);
	  	}
  	}
  }
}

function sendData(data, fileid){
	document.getElementById("iframe-" + fileid).contentWindow.postMessage(JSON.stringify(data), "*");
}

function addTab(title, id, welcome){
  
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
    var base = "<span class='tab-tab' data-fileid='"+id+"' onclick='opentab(\""+id+"\")'><h4>" + title + "</h4>";
    base = base + "<h6 onclick='removetab(\""+id+"\")'>&times;</h6>";

    base = base + "</span>";

    $(".tab-container").html($(".tab-container").html() + base);

    var codemirror = "<div class='codemirror-container' id='"+id+"' data-fileid='"+id+"' style='display:none'><iframe src='https://codeyourcloud.com/script/logic/logic.html?id="+id+"' style='display:none' id='iframe-"+id+"'></iframe></div>";
    $("#insert-point").after(codemirror);
    
    var chat = "<div class='poly-chat-content' data-fileid='"+id+"' style='display:none'></div>";
    $(".poly-chat").html(chat+$(".poly-chat").html());

	var user = "<div class='users-container' data-fileid='"+id+"' style='display:none'></div>";
	$("#users").html($("#users").html() + user);
	
    var e = CodeMirror(document.getElementById(id),{
         lineNumbers: true,
         mode: "text",
         theme: theme_sql,
         lineWrapping: true, 
         indentUnit: 4, 
         indentWithTabs: true
    });
    
    e.id = id;


    add_editor(e, id, welcome);
    
    current_file = id;
    
    editor().on("beforeSelectionChange", function(cm, selection){
      set_color(editor().getSelection());	
    });
    editor().setOption("autoCloseBrackets",true);
    editor().setOption("matchBrackets",true);
    editor().on("change", function(cm, change) {
    	
    	if(!getIgnore(cm.id)){
    	
	    	sendData({
		    	type: "text",
		    	text: cm.getValue()
	    	},cm.id);
    	
    	}
    	else{
	    	setIgnore(cm.id, false);
    	}
    });
    editor().setOption("lineNumbers",line_wrap);
    editor().setOption("lineWrapping",line_number);
    

    opentab(id);
  }
}

function opentab(id){
	hide_top_rename();	

	$(".tab-active").removeClass("tab-active");
	$(".tab-tab[data-fileid='"+id+"']").addClass("tab-active");
	
	$(".codemirror-active").css("display","none");
	$(".codemirror-active").removeClass("codemirror-active");
	
	$(".codemirror-container[data-fileid='"+id+"']").css("display","block");
	$(".codemirror-container[data-fileid='"+id+"']").addClass("codemirror-active");
	//
	$(".users-container-active").css("display","none");
	$(".users-container-active").removeClass("users-container-active");
	
	$(".users-container[data-fileid='"+id+"']").css("display","block");
	$(".users-container[data-fileid='"+id+"']").addClass("users-container-active");
	
	//
	$(".poly-chat-content-active").css("display","none");
	$(".poly-chat-content-active").removeClass("poly-chat-content-active");
	
	$(".poly-chat-content[data-fileid='"+id+"']").css("display","block");
	$(".poly-chat-content[data-fileid='"+id+"']").addClass("poly-chat-content-active");
  
	$(".CodeMirror").css("font-size","12px");
  
	current_file = id;
  
	editor().refresh();
	
	//adjust things here
	var index = getIndex(id);
	
	if(editors[index].welcome){
		//default
		$("#title").html("Code Your Cloud");
		$("#rename-toggle").css("display","none");
		$("#rename_input").val("");
		$("#chat_button").css("display","none");
	}
	else{
		//a file
		$("#title").html(editors[index].title);
		$("#rename-toggle").css("display","inline-block");
		$("#rename_input").val(editors[index].title);
		$("#chat_button").css("display","inline-block");
	}
	
	adjust();
	
}

function removetab(id){
	$(".tab-tab[data-fileid='"+id+"']").remove();
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
  
  $("#chat_button").css("display","none");
}

function adjust(){
	var id = current_file;
	
	if(id === "welcome"){
		$(".side-file").css("display","none");
		if(!is_mobile){
			$(".poly-chat").slideUp();
		}
	}
	else{
		$(".side-file").css("display","inline-block");
	}
	
	var mode = editor().getOption("mode");
	
	$(".side-run").addClass("hide"); //<------|
	$(".side-pub").addClass("hide"); //<-----------------------------------------------IMPORTANT
	
	if(mode === "text/javascript"){
		$(".side-run").removeClass("hide"); //<------------
	}
	else if(mode === "text/x-coffeescript"){
		$(".side-run").removeClass("hide"); //<---------
	}
	
	else if(mode === "text/html"){
		$(".side-pub").removeClass("hide"); //<--------------
	}
	
	else if(mode === "text/x-markdown" || mode === "gfm"){
		$(".side-pub").removeClass("hide"); //<------------
	}
}

adjust();

function chat(){
	if(is_mobile){
		showDialog("chat");
	}
	else{
		$(".poly-chat").slideToggle();
	}
	
	$(".chat-input").focus(function(){
		$(".chat-input").animate({
	    	height: "150px"
		},300);
	});
	$(".chat-input").blur(function(){
		$(".chat-input").animate({
			height: "30px"
		},300);
	});
}


function insert_chat(message, you, photo, name, fileid){

  var push = "<div class=\"chat-item\">";
  push = push + "<div class=\"header-item\">";
  push = push + "<img height=\"30px\" width=\"30px\" src=\""+ photo +"\">";
  push = push + "<h4>" + name + "</h4></div><div class=\"message-item\"><pre>";
  push = push + message + "</pre></div></div>";
  $(".poly-chat-content[data-fileid='"+fileid+"']").html($(".poly-chat-content[data-fileid='"+fileid+"']").html() + push);
  
  $(".poly-chat-content[data-fileid='"+fileid+"']").animate({ scrollTop: $(".poly-chat-content[data-fileid='"+fileid+"']")[0].scrollHeight}, 500);
}

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
