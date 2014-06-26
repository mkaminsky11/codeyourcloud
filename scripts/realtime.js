//the codemirror editor
editor = CodeMirror.fromTextArea(document.getElementById("bind"),{
    lineNumbers: true,
    mode: "text",
    theme: "code-your-cloud",
    lineWrapping: true, 
    indentUnit: 4, 
    indentWithTabs: true
});
editor.on("beforeSelectionChange", function(cm, selection){
	set_color(editor.getSelection());	
});
editor.setOption("autoCloseBrackets",true);
editor.setOption("matchBrackets",true);
$(".CodeMirror").css("line-height","1");

/*===========
AUTHORIZATION
=============*/
function loadDrive(){
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleAuth);
}
//handles result
function handleAuth(authResult){
	if (!authResult.error) {
		logged_in = true;
		loadClient();
		console.log("%cThe user is logged in","color:#34495E; font-size: 12px; font-weight: bold");
	} 
	else {
		console.log("%cThe user is not logged in", "color:#34495E; font-size: 12px; font-weight: bold");
		window.location = "https://codeyourcloud.com/about";
	}
}

function loadClient() {
	gapi.client.load('drive', 'v2', load_drive);
	if(window.location.href.indexOf("#") !== -1 && window.location.href.indexOf("state") === -1 && window.location.href.indexOf("?") === -1){
		current = window.location.href.split("#")[1];
		gapi.load("auth:client,drive-realtime,drive-share", load_real); //<--------only do this if there is a #
	}
	else if(window.location.href.indexOf("?") !== -1){
		var query = window.location.href.split("?")[1];
		if(query.indexOf("create") !== -1){
			var query_folder_id = query.split("%22")[3];
			insertNewFile(query_folder_id);
		}
		else if(query.indexOf("open") !== -1){
			var query_id = query.split("%22")[3];
			window.location.href = "https://codeyourcloud.com/#" + query_id;
		}
		else{
			welcome();
		}
	}
	else{
		welcome();
	}
	
}

function load_drive(){
	setInterval(function(){
		refreshToken();
	},3000000);
	get_info();
	drive_loaded = true;
	if(real_loaded){
		init();
	}
}
function refreshToken() {
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate':true},function(result){
		
	});
}

function load_real(){
	real_loaded = true;
	if(drive_loaded){
		init();
	}
}
function init(){
	gapi.drive.realtime.load(current, loaded_realtime, init_realtime, errorFn);
}
/*===========
EVENTS
============*/
var onChange = function(event){
	//text changed
	if(!event.isLocal){
		console.log(event);
		if(event.type === "text_inserted"){
			var insert_point = editor.posFromIndex(event.index);
			editor.replaceRange(event.text, insert_point);
		}
		else if(event.type === "text_deleted"){
			var back_point = editor.posFromIndex(event.index);
			var front_point = editor.posFromIndex(event.index + event.text.length);
			editor.replaceRange("", back_point, front_point);
		}
		
	}
};

var onCur = function(event){

};

var titleChange = function(event){
	if(!event.isLocal){
		$("#rename_input").val(title.getText());
		$("#title").html(title.getText());
		$("title").html(title.getText());
		check_mode(title.getText());
	}
}
window.onbeforeunload = function (e) {
	if(logged_in){
		save();
	}
};


var userLeft = function(doc){
	
	
	if(!doc.collaborator.isMe){
		var the_id = doc.collaborator.sessionId;
		
		removeUser(the_id);
	}
};

var userJoin = function(doc){
	try{
		
		var col = doc.collaborator;
		if(!col.isMe){
			insertUser(col.userName,col.color,col.photoUrl,col.sessionId);
		}
		$(".user-photo").each(function(index){
			if($(this).css("height") === "1px"){
				$(this).css("height","53px");
			}
		});
	}
	catch(e){
	}
};

var newChat = function(event){
	try{
		var array = chats.asArray();
		var last_index = array.length - 1;
		if(event.isLocal){
			//done by you
			insertChat(array[last_index][0], array[last_index][1], true, your_photo);
		}	
		else{
			//done by someone else
			insertChat(array[last_index][0], array[last_index][1], false, array[last_index][3]);
		}
		if(!chat_open && !event.isLocal){
			sendMessage("new message", "info");
		}
	}
	catch(e){
	}
};
/*===========
INIT
===========*/
/*


*/
function loaded_realtime(doc){
	editor.refresh();
	doc_real = doc;
	if(typeof doc !== 'undefined'){
		if(!init_needed || (init_needed && init_loaded)){
			editor.setValue(doc_real.getModel().getRoot().get("text").getText());
			
			text = doc.getModel().getRoot().get("text");
			text.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, onChange);
			text.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, onChange);
			
			list = doc.getModel().getRoot().get("cursors");
			list.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, onCur);
			list.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, onCur);
			list.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, onCur);
			
			chats = doc.getModel().getRoot().get("chat");
			chats.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, newChat);
			
			doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, userLeft);
			doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, userJoin);
			
			
			var col = doc_real.getCollaborators();
			for(var i = 0; i < col.length; i++){
				if(col[i].isMe){
					your_session_id = col[i].sessionId;
					your_color = col[i].color;
					your_user_id = col[i].userId;
					your_name = col[i].displayName;
					your_photo = col[i].photoUrl
				}
				else{
					insertUser(col[i].userName, col[i].color, col[i].photoUrl, col[i].sessionId);
				}
			}

			var chats_so_far = chats.asArray();
			//[message,name,userid,photo]
			for(var a = 0; a < chats_so_far.length; a++){
				if(chats_so_far[a][2] === your_user_id){
					//written by you
					insertChat(chats_so_far[a][0], chats_so_far[a][1], true, chats_so_far[a][3]);
				}
				else{
					//written by someone else
					insertChat(chats_so_far[a][0], chats_so_far[a][1], false, chat_so_far[a][3]);
				}
			}
			
			
			//binding = gapi.drive.realtime.databinding.bindString(text,document.getElementById("bind"));
			editor.on("change", function(cm, change) {
				if(is_welcome !== true){
					$("#save_button").css("color","#E74C3C");
				}
				wer_changes = true;
				text.setText(editor.getValue());
			});
			
			editor.on("cursorActivity", function(cm){
				
				
				were_changes = true;
			});
			
			window.setInterval(function(){
				if(!was_error && were_changes){
					save();
				}
			}, 10000); //every 10 seconds
			loaded_title(doc);
		}
	}
}
$("#save_button").css("color","#E74C3C");
function loaded_title(doc){
	if(typeof doc !== 'undefined'){
		if(!init_needed || (init_needed && title_loaded)){
			title = doc.getModel().getRoot().get("title");
			
			try{
				title.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, titleChange);
			}
			catch(e){
				/*
				sometimes this throwns an error because the values weren't initialized properly.
				To fix this, re-init
				*/
                init_realtime(doc_real.getModel());
			}
			
			title.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, titleChange);
			$("#rename_input").val(title.getText());
			$("#title").html(title.getText());
			$("title").html(title.getText());
			check_mode(title.getText());
			//done
			lift_screen();
		}
	}
}

function get_info(){
    var request = gapi.client.drive.about.get();
    request.execute(function(resp) {
        myRootFolderId = resp.rootFolderId;
        
        try{
        	myEmail = resp.user.emailAddress;
        	$("#side-email").html(myEmail);
        	/*
        	if there is an error here, the user cannot be found. Therefore, he is not logged in
        	*/
        }
        catch(e){
        	window.location = "https://codeyourcloud.com/about";
        }
        
        userName = resp.name;
        try{
            userUrl = resp.user.picture.url;
        }
        catch(e){}
        try{
            userId = resp.user.permissionId;
            $("#side-pub-link").attr("href", "https://codeyourcloud.com/pub/"+userId+"/index.html");
            user_loaded = true;
            if(sql_loaded){
	            get_sql();
            }
            
        }
        catch(e){}
        total_q = resp.quotaBytesTotal;
        user_q = resp.quotaBytesUsedAggregate;
        product_q = Math.round(user_q/total_q * 100);
        
        user_loaded = true;
        if(sql_loaded){
        	get_sql();
        }
    });
}
function welcome(){
	
	$("#rename-toggle").addClass("hide");
	
	$(".run-elem").addClass("hide");
	$(".html-elem").addClass("hide");
	
	$(".side-file").addClass("hide");
	
	
	
	
	$("#col_button").remove();
	is_welcome = true;
	
	var txtFile = new XMLHttpRequest();
	txtFile.open("GET", "https://codeyourcloud.com/intro.txt", true);
	txtFile.onreadystatechange = function()
	{
		if (txtFile.readyState === 4) {  // document is ready to parse.
			if (txtFile.status === 200) {  // file is found
				var allText = txtFile.responseText; 
				editor.setValue(allText);
			}
		}
	}
	txtFile.send(null);
	
	
	$("#save_button").addClass("hide");
	lift_screen();
}
/*============
CURSOR
===========*/

function init_realtime(model){
	init_needed = true;
	getContentOfFile(current, model);
}
function errorFn(error){
	console.log(error);
	if(error.Fe.toLowerCase() === "not found"){
		document.location.href = "https://codeyourcloud.com/error/fileNotFound";
	}
	was_error = true;
	main_error();
}

function insertCursor(line, ch, color,id){
	var coors = editor.cursorCoords({line:line,ch:ch},"local");
	var x = coors.left + Number($(".CodeMirror-gutters").css("width").replace("px","")) + 1;
	var y = coors.top;
	var elem = "<div id=\"cur_"+ id +"\" class=\"marker\" style=\"left:"+ x + "px;top:" + y + "px;background-color:" + color + ";position:absolute\" data-top=\"" + y + "px\" data-left=\""+ x +"px\"></div>";
	$("#overlay").html($("#overlay").html() + elem);
	$(".marker").each(function(index){
		$(this).css("height", sql_font + "px");
	})
	
}
/*============
USERS
=============*/
function insertUser(name, color, photo, id){
	var new_user = "<img class=\"user-photo\" id=\"img_" + id + "\" src=\""+ photo +"\" height=\"53px\" width=\"53px\" style=\"border:solid 4px "+ color +";display:none\">";
	$("#users").html($("#users").html() + new_user);
	$("#img_" + id).slideDown("slow",function(){
		$("#img_" + id).css("height","53px");
	});
}
function removeUser(id){
	try{
		$("#img_" + id).slideUp("slow",function(){
			$("#img_" + id).remove();
		});
	}
	catch(e){
	}
}
/*===========
CHAT
============*/
function showChat(){
	if(is_mobile){
		show_side_chat();
	}
	else{
		if(!chat_open){
			chat_open = true;
			$(".mains").animate({
				width: "80%"	
			}, 1000, function(){
				//open
			});
		}
	}
}

function closeChat(){
	if(is_mobile){
		hide_side_modal();
	}
	else{
		if(chat_open){
			chat_open = false;
			$(".mains").animate({
				width: "100%"	
			}, 1000, function(){
				//open
			});
		}
	}
}

function insertChat(message,name,you,photo){
	var id = total_chat + 1;
	total_chat++;
	var the_class = "other-bubble";
	var img_class = "other-image";
	if(you){
		the_class = "your-bubble";
		img_class = "your-image";
	}
	
	var img = "<img src=\""+ photo +"\" class=\""+ img_class +"\">";
	if(is_mobile){
		img = "";
	}
	var div_inner = "<div class=\"bubble "+ the_class + "\">" + message + "</div>";
	var div_outer = "<div id=\"div_"+ id +"\" class=\"bubble-div\">" + img + div_inner + "</div>";
	$("#chat_inner").html($("#chat_inner").html() + div_outer);
	
	$("#chat_inner").animate({ scrollTop: $("#chat_inner")[0].scrollHeight}, 1000);
}

function makeChat(){
	var new_message = $("#chat_text").val();
	var message = new_message.split(">").join("").split("<").join("").split(";").join("");
	$("#chat_text").val("");
	
	var make = [message, your_name, your_user_id, your_photo];
	chats.push(make);
}

$("#chat_text").keyup(function(e){
    var code = (e.keyCode ? e.keyCode : e.which);
	if(code == 13) { 
		makeChat();
	}
});

/*===============
SAVING
================*/
function save(){
	if(is_welcome !== true){
		var content = text.getText();
		if(typeof content !== "undefined"){ //if nothing is "null"
	        var contentArray = new Array(content.length);
	        for (var i = 0; i < contentArray.length; i++) {
	            contentArray[i] = content.charCodeAt(i);
	        }
	        var byteArray = new Uint8Array(contentArray);
	        var blob = new Blob([byteArray], {type: 'text/plain'}); //this is the only way I could get this to work
	        var request = gapi.client.drive.files.get({'fileId': current});//gets the metadata, which is left alone
	        
	        $("#save_button").css("color","white");
	        
	        request.execute(function(resp) {
	            updateFile(current,resp,blob,changesSaved);
	        });
	    }
    }
}
function changesSaved(){
	were_changes = false;
	console.log("%cChanges saved","color:#2ECC71; font-size: 12px;");
	$("#save_button").css("color","white");
}

function clear_chat_history(){
	chats.clear();
}