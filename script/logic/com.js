window.addEventListener("message", receiveMessage, false);

function receiveMessage(event){
  if(event.data !== "!_{h:''}"){
  	var json = JSON.parse(event.data);
  	
  	
  	if(json.type === "title"){
	  	title.setText(json.title);
	  	renameFile(current_file, title.getText());
  	}
  	else if(json.type === "save"){
	  	save();
  	}
  	else if(json.type === "newchat"){
  		console.log("new");
	  	makeChat(json.message, json.name, json.id, json.photo);
  	}
  	else if(json.type === "text"){
  		try{
		  	text.setText(json.text);
		}
		catch(e){
		}
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
		value: value,
		currentfile: current_file
	});
}

function insertUser(the_username, the_color, the_photo, the_sessionId, col){
	sendData({
		type:"insert_user",
		name:the_username,
		color:the_color,
		photo: the_photo,
		session: the_sessionId,
		col: col,
		currentfile: current_file
	});
}

function removeUser(the_id){
	sendData({
		type: "delete_user",
		id: the_id,
		currentfile: current_file
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
		photo: the_photo,
		currentfile: current_file
	});
}

function insert_text(point, text){
	sendData({
		type: "insert_text",
		point: point,
		text: text,
		currentfile: current_file
	});
}

function delete_text(back, front){
	sendData({
		type: "delete_text",
		back: back,
		front: front,
		currentfile: current_file
	});
}

function sendTitle(title){
	sendData({
		type: "title",
		title: title,
		currentfile: current_file
	});
}
