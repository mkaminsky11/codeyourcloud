

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){
  if(event.data !== "!_{h:''}"){
  	var json = JSON.parse(event.data);
  	if(typeof json.s === 'undefined'){
		//this makes sure that only the intended messages are getting in. There are some "background" ones
	  	
	  	var id = json.currentfile;
	  	
	  	if(json.type === "text"){
		  	getEditor(id).setValue(json.value);
		  	hide_loading_spinner();
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
  
  if(title === "loading..."){
	show_loading_spinner();
  }

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
    base = base + "<h6><i class='md-close' onclick='removetab(\""+id+"\")' style='float:right'></i></h6>";
    base = base + "</span>";
    $(".tab-container").html($(".tab-container").html() + base);
    var codemirror = "<div class='codemirror-container' id='"+id+"' data-fileid='"+id+"' style='display:none'><iframe src='https://codeyourcloud.com/js/logic/logic.html?id="+id+"' style='display:none' id='iframe-"+id+"'></iframe></div>";
    $("#insert-point").after(codemirror);
    var chat = "<div class='chats-content' data-fileid='"+id+"' style='display:none'></div>";
    
    $(".chats-store").each(function(index){
	    $(this).html(chat + $(this).html());
	 });
    
    
	var user = "<div class='users-container' data-fileid='"+id+"' style='display:none'></div>";
	$("#users").html($("#users").html() + user);
	
	var manager = "<div data-refersto='"+id+"'><h5>" + title + "<i class='md-delete' onclick='removetab(\""+id+"\")'></i><i class='md-remove-red-eye' onclick='opentab(\""+id+"\")'></i></h5></div>";
	$("#tab-manager").html($("#tab-manager").html() + manager);
	
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
    	
    	window.setTimeout(function(){
	    	mini();
    	}, 200);
    	//mini();
    });
    
    editor().setOption("lineNumbers",line_wrap);
    editor().setOption("lineWrapping",line_number);
    opentab(id);
    
    $(".CodeMirror-scroll").scroll(function(){
	   miniView();
	});
  }
  
}

function opentab(id){
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
	adjust();
	mini();
	miniView();
}

function removetab(id){
	hide_loading_spinner();	

	//$(".tab-tab[data-fileid='"+id+"']").remove();
	$(".tab-tab[data-fileid='"+id+"']").velocity("transition.slideUpOut",{
		duration: 400,
		drag: true,
		complete: function(){
			$(".tab-tab[data-fileid='"+id+"']").remove();
		}
	});
	$(".codemirror-container[data-fileid='"+id+"']").remove();
	$(".users-container[data-fileid='"+id+"']").remove();
	
	$("#tab-manager div[data-refersto='"+id+"']").remove();
  
	var index = -1;
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			index = i;
		}
	}

	current_file = "";
	editors.splice(index,1);
}

function adjust(){
	var id = current_file;
	
	if(id === "welcome"){
		$(".side-file").css("display","none");
		$("#chat-popup").slideUp();
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
	catch(e){
	}
	
	$(".side-run").addClass("hide"); //<------|
	$(".side-pub").addClass("hide"); //<-----------------------------------------------IMPORTANT
	
	if(mode === "text/javascript" || mode === "text/x-python"){
		$(".side-run").removeClass("hide"); //<------------
	}
	else if(mode === "text/x-coffeescript"){
		$(".side-run").removeClass("hide"); //<---------
	}
	
	else if(mode === "text/html"){
		$(".side-pub").removeClass("hide"); //<--------------
	}
	
	else if(mode === "text/x-markdown" || mode === "gfm" || mode === "markdown"){
		$(".side-pub").removeClass("hide"); //<------------
	}
}

adjust();

function chat(){
	
}


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
