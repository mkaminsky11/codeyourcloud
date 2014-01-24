var connection = new WebSocket('ws://64.207.146.34:8080');
var sshSession = "";
connection.onopen = function () {
	console.log("open");
    /*INITIALIZE*/
    if(document.URL.indexOf("ssh") === -1){
    	websocketInit();
    }
    else{
	    
    }
	connection.send(JSON.stringify({type: "update", name: userName}));
};
function websocketInit(){
	//get the init info
	connection.send(JSON.stringify({type: "request", data: "init", session: current}));
	connection.send(JSON.stringify({type: "update", name: userName}));
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
			//connection.send(JSON.stringify({type: "update", name: userName}));
			notify(json.name);
		}
	} catch (e) {
		//invalid json
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
