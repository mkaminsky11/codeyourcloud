var connection = new WebSocket('wss://codeyourcloud.com:8080');
var rec = false;
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
		
		if(json.type === "print"){
			print_sql(json.message);
		}
		if(json.type === "get"){
			rec = true;
			//FONT_SIZE *done
			$("#content").css("fontSize", json.font_size+"px");
			$("#spinner-font").val(json.font_size);
			sql_font = json.font_size;
			//WRAP *done
			if(line_wrap !== to_bool(json.wrap)){
				$("#line_wrap_switch>small" ).trigger( "click" );
			}
			line_wrap = to_bool(json.wrap);
			editor.session.setUseWrapMode(line_wrap);
			//NUMS *done
			if(line_number !== to_bool(json.nums)){
				$("#line_num_switch>small" ).trigger( "click" );
			}
			line_number = to_bool(json.nums);
			editor.renderer.setShowGutter(line_number); 
			//AUTO_COMP
			if(autoC !== to_bool(json.auto_comp)){
				$("#auto_bind_switch>small" ).trigger( "click" );
			}
			autoC = to_bool(json.auto_comp);
			//AUTO_SAVE
			if(auto_save !== to_bool(json.auto_save)){
				$("#auto_save_switch>small" ).trigger( "click" );
			}
			auto_save = to_bool(json.auto_save);
			//AUTO_TIME
			auto_save_int = json.auto_time;
			$("#save_int").val(auto_save_int/1000);
		}
		if(json.type === "new"){
			set_sql();	
		}
		
	} catch (e) {
		return;
	}
};
function to_bool(int_val){
	if(int_val === 1){
		return true;
	}
	else{
		return false;
	}
}
function to_int(bool_val){
	if(bool_val){
		return 1;
	}
	else{
		return 0;
	}
}
/********
SQL
**********/
function set_sql(){
	if(rec){
		//get the data
		//send it
		var ret = {};
		ret.id = userId;
		ret.theme = theme_sql;
		ret.font_size = sql_font;
		ret.wrap = to_int(line_wrap);
		ret.nums = to_int(line_number);
		ret.auto_comp = to_int(autoC);
		ret.auto_save = to_int(auto_save);
		ret.auto_time = auto_save_int;
		ret.type = "set";
		connection.send(JSON.stringify(ret));
	}
}
function print_sql(message){
	console.log(message);
}
function get_sql(){
	connection.send(JSON.stringify({type:"get", id:userId}));
}
function publish(){
	connection.send(JSON.stringify({type:"publish", id:userId, lines:editor.getValue().split("\n")}));
}
/*********
LEAVE THESE ALONE FOR NOW
**********/
connection.onerror = function (error) {
};
function sendSave(){
}
function sendRename(){
	var newTitle = document.getElementById("renameInput").value;
}
function sendMode(newMode){
}
function sendTheme(newTheme){
}
