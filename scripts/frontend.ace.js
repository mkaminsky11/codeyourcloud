var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("open");
	sql_loaded = true;
    /*INITIALIZE*/
    websocketInit();
    if(user_loaded){
	    
    }
};
function websocketInit(){
	
}
connection.onmessage = function (message) {
	try {
		var json = JSON.parse(message.data);
		
	} catch (e) {
		return;
	}
};
connection.onerror = function (error) {
	//uh oh...
};
function sendSave(){
	//
}
function sendRename(){
	var newTitle = document.getElementById("renameInput").value;
	//
}
function sendMode(newMode){
	//
}
function sendTheme(newTheme){
	//
}
/*
*
*
*
*/
function get_sql(){
	
}
function set_sql(id, theme, font_size, wrap, num, auto_comp, auto_save, auto_time){
	
}
