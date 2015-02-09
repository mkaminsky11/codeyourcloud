var onChange = function(event){
	if(!event.isLocal){
		if(event.type === "text_inserted"){
			var insert_point = event.index;
			
			insert_text(insert_point, event.text);
		}
		else if(event.type === "text_deleted"){
			var back_point = event.index;
			var front_point = event.index + event.text.length;
			
			delete_text(back_point, front_point);
		}
		
	}
};

var newChat = function(event){
	var array = chats.asArray();
	var last_index = array.length - 1;
	if(event.isLocal){
		//done by you
		insertChat(array[last_index][0], array[last_index][1], true, your_photo, true);
	}	
	else{
		//done by someone else
		insertChat(array[last_index][0], array[last_index][1], false, array[last_index][3], true);
	}
};

var titleChange = function(event){
	if(!event.isLocal){
		sendTitle(title.getText());
	}
}


var userLeft = function(doc){
	if(!doc.collaborator.isMe){
		var the_id = doc.collaborator.sessionId;
		removeUser(the_id);
	}
};

var userJoin = function(doc){
	if(!doc.collaborator.isMe){
		var col = doc.collaborator;
		insertUser(col.displayName,col.color,col.photoUrl,col.sessionId, col);
	}
};

function loaded_realtime(doc){
	console.log("loaded");
	doc_real = doc;
	if((!init_needed || (init_needed && init_loaded)) && typeof doc !== 'undefined'){
		
		console.log("inner");
		
		setValue(doc_real.getModel().getRoot().get("text").getText());
		
		text = doc.getModel().getRoot().get("text");
		text.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, onChange);
		text.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, onChange);

		
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
				your_photo = col[i].photoUrl;
				
				sendData({
					type: "info_realtime",
					session: your_session_id,
					color: your_color,
					id: your_user_id,
					name: your_name,
					photo: your_photo,
					currentfile: current_file
				});
			}
			else{
				insertUser(col[i].displayName, col[i].color, col[i].photoUrl, col[i].sessionId, col[i]);
			}
		}

		var chats_so_far = chats.asArray();
		for(var a = 0; a < chats_so_far.length; a++){
			if(chats_so_far[a][2] === your_user_id){
				//written by you
				insertChat(chats_so_far[a][0], chats_so_far[a][1], true, chats_so_far[a][3], false);
			}
			else{
				//written by someone else
				insertChat(chats_so_far[a][0], chats_so_far[a][1], false, chats_so_far[a][3], false);
			}
		}
		
		loaded_title(doc);
	}
}

function loaded_title(doc){
	if(typeof doc !== 'undefined'){
		if(!init_needed || (init_needed && title_loaded)){
			title = doc.getModel().getRoot().get("title");
			
			try{
				title.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, titleChange);
			}
			catch(e){

                init_realtime(doc_real.getModel());
			}
			
			try{
				sendTitle(title.getText());
			}
			catch(e){
			}
		}
	}
}

function makeChat(m){
	var message = m.split(">").join("").split("<").join("").split(";").join("");
	
	var make = [message, your_name, your_user_id, your_photo];
	chats.push(make);
}

function makeChat(message,name,id,photo){
	var m = message.split(">").join("").split("<").join("").split(";").join("");
	
	var make = [m, name, id, photo];
	chats.push(make);
	console.log("push");
}