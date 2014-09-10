window.addEventListener("message", receiveMessage, false);

function receiveMessage(event){
  if(event.data !== "!_{h:''}"){
  	var json = JSON.parse(event.data);
  	
  	
  	if(json.type === "folder"){
	  	justFolder(json.id);
  	}
  	else if(json.type === "reload"){
	  	window.location.reload();
  	}
  	else if(json.type === "back"){
	  	one_folder_back(json.folder);
  	}
  	else if(json.type === "command"){
	  	eval(json.command);
  	}
  	else if(json.type === "title"){
	  	title.setText(json.title);
	  	renameFile(current, title.getText());
  	}
  	else if(json.type === "save"){
	  	save();
  	}
  	else if(json.type === "new"){
	  	insertNewFile(json.folder);
  	}
  	else if(json.type === "text"){
  		try{
		  	text.setText(json.text);
		}
		catch(e){
		}
  	}
  	else if(json.type === "permissions"){
	  	getP(json.id);
  	}
  	else if(json.type === "add_p"){
	  	insertPermission(json.id, json.email, json.type, json.role);
  	}
  	else if(json.type === "remove_p"){
	  	removePermission(json.file, json.id);
  	}
  	else if(json.type === "new_chat"){
	  	makeChat(json.message, json.name, json.id, json.photo);
  	}
  	else if(json.type === "shared"){
	  	sharedWithMe();
  	}
  	else if(json.type === "save_as"){
	  	insert_saveas(json.data, json.title, json.folder);
  	}
  }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function sendData(data){
	parent.postMessage(JSON.stringify(data), "*");
}

function setValue(value){
	sendData({
		type: "text",
		value: value
	});
}

function insertUser(the_username, the_color, the_photo, the_sessionId, col){
	sendData({
		type:"insert_user",
		name:the_username,
		color:the_color,
		photo: the_photo,
		session: the_sessionId,
		col: col
	});
}

function removeUser(the_id){
	sendData({
		type: "delete_user",
		id: the_id
	});
}

function setText(value){
	text.setText(value);
}

function insertChat(the_message, the_name, is_you, the_photo){
	sendData({
		type: "insert_chat",
		message: the_message,
		name: the_name,
		you: is_you,
		photo: the_photo
	});
}

function insert_text(point, text){
	sendData({
		type: "insert_text",
		point: point,
		text: text
	});
}

function delete_text(back, front){
	sendData({
		type: "delete_text",
		back: back,
		front: front
	});
}

function sendFolder(folder, id, name){
	sendData({
		type: "folder",
		folder: folder,
		id: id
	});
}

function perError(){
	sendData({
		type:"error",
		error:"permission"
	});
}

function sendTitle(title){
	sendData({
		type: "title",
		title: title
	});
}

function sendNew(n){
	sendData({
		type: "new",
		id: n
	});
}

function sendP(p){
	sendData({
		type: "permissions",
		p: p
	});
}

function parent_error(){
	sendData({
		type: "parent_error"
	});
}