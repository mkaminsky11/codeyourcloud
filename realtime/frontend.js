var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("open");
    websocketInit();
};
function websocketInit(){
	sql_loaded = true;
	if(user_loaded){
		get_sql();
	}
}
connection.onmessage = function (message) {
	try {
		var json = JSON.parse(message.data);
		if(json.type === "get"){
			rec = true;
			theme_sql = json.theme;
			//FONT_SIZE *done
			$(".CodeMirror").css("fontSize", json.font_size+"px");
			$("#spinner-font").val(json.font_size);
			sql_font = json.font_size;
			//WRAP *done
			if(line_wrap !== to_bool(json.wrap)){
				$("#wrap_switch>small" ).trigger( "click" );
			}
			line_wrap = to_bool(json.wrap);
			editor.session.setUseWrapMode(line_wrap);
			//NUMS *done
			if(line_number !== to_bool(json.nums)){
				$("#number_switch>small" ).trigger( "click" );
			}
			line_number = to_bool(json.nums);
			editor.renderer.setShowGutter(line_number); 
		}
		if(json.type === "new"){
			set_sql();	
		}
		if(json.type === "pub"){
			console.log("published");
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
function get_sql(){
	connection.send(JSON.stringify({type:"get", id:userId}));
}
function publish_html(){
	connection.send(JSON.stringify({type:"publish", id:userId, lines:editor.getValue().split("\n")}));
}
/*********
LEAVE THESE ALONE FOR NOW
**********/
connection.onerror = function (error) {
};