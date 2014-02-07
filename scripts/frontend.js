var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("open");
    /*INITIALIZE*/
    if(document.URL.indexOf("ssh") === -1){
    	websocketInit();
    }
    else{
	    
    }
};
function websocketInit(){
	//get the init info
	connection.send(JSON.stringify({type: "request", data: "init", session: current}));
}
connection.onmessage = function (message) {
	try {
		var json = JSON.parse(message.data);
		if(json.type === "init"){
			
		}
		if(json.type === "command"){
			if(json.command === "save"){
				saveNoSend();
			}
			if(json.command === "rename"){
				var newTitle = json.title;
				document.getElementById("renameInput").value = newTitle;
				okRenameNoSend();
			}
			if(json.command === "mode"){
				var newMode = json.mode;
				setModeNoSend(newMode);
			}
			if(json.command === "theme"){
				var newTheme = json.theme;
				setThemeNoSend(newTheme);
			}
		}
		if(json.type === "update"){
			var name = json.name;
			//notify(name);
		}
	} catch (e) {
		return;
	}
};
connection.onerror = function (error) {
	//uh oh...
};
function sendSave(){
	connection.send(JSON.stringify({type:"command", command:"save"}));
}
function sendRename(){
	var newTitle = document.getElementById("renameInput").value;
	connection.send(JSON.stringify({type:"command", command:"rename", title:newTitle}));
}
function sendMode(newMode){
	connection.send(JSON.stringify({type:"command", command:"mode", mode: newMode}));
}
function sendTheme(newTheme){
	connection.send(JSON.stringify({type:"command", command:"theme", theme: newTheme}));
}
