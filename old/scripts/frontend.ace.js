var connection = new WebSocket('wss://codeyourcloud.com:8080');
var rec = false;
var content_check = false;
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
			//THEME *done
			editor.setTheme("ace/theme/" + json.theme);
			theme_sql = json.theme;
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
		if(json.type === "add"){
			others = json.data;
			console.log(others);
			if(!content_check){
				for(var i = 0; i < others.length;i++){
					if(typeof others[i].content !== 'undefined' && others[i].content.join("\n") !== editor.getValue() && !content_check){
						editor.setValue(others[i].content.join("\n"));
						content_check = true;
					}
				}
				content_check = true;
			}
			
			for(var j = 0; j < others.length;j++){
				if(typeof others[j].done === 'undefined' && others[j].user !== userId){
					//add them, they're not done
					others[j].done = true;
					addColUser(others[j].name, others[j].pic, others[j].color, others[j].user);
				}
			}
		}
		if(json.type === "remove"){
			//console.log(json.data);
			//a number
			removeColUser(json.data);
			var d = false;
			for(var i = 0; i < others.length; i++){
				if(others[i].user = json.data && others[i].id === json.remove_id){
					others.splice(i,1);
					try{
						editor.session.removeMarker(others[i].mark);
					}
					catch(e){
					
					}
				}
			}
			
			console.log(others);
		}
		if(json.type === "insertText"){
			trigger++;
			editor.session.insert({row:json.row, column: json.col}, json.text);
		}
		if(json.type === "removeText"){
			trigger++;
			editor.session.remove(new Range(json.row, json.col, json.endrow, json.endcol))
		}
		if(json.type === "select"){
			var id = json.id;
			var old = -1;
			for(var i = 0; i < others.length; i++){
				if(id === others[i].user){
					//found the right guy
					if(typeof others[i].mark === 'undefined'){
						//no mark
						others[i].mark = editor.session.addMarker(new Range(json.row, json.col, json.endrow, json.endcol), others[i].color, true);
					}
					else{
						//there is a mark
						editor.session.removeMarker(others[i].mark);
						if(json.col < json.endcol){
							others[i].mark = editor.session.addMarker(new Range(json.row, json.col, json.endrow, json.endcol), others[i].color, true);
						}
						else{
							others[i].mark = editor.session.addMarker(new Range(json.row, json.endcol, json.endrow, json.col), others[i].color, true);	
						}
					}
				}
			}
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
/**********
COLLAB
***********/
function start_col(){
	use_col = true;
	connection.send(JSON.stringify({type:"intro", name: userName, picture: userUrl, id:current, userid:userId}));
}

function sendCursor(row,col){
	//console.log(row + " " + col);
}
function sendSelect(row, col, endrow, endcol){
	connection.send(JSON.stringify({type:"select", col:col, row:row, endrow:endrow, endcol:endcol, content:editor.getValue()}));
}
function sendChange(e){
	var action = e.data.action;
	var row = e.data.range.start.row;
	var col = e.data.range.start.column;
	var endrow = e.data.range.end.row;
	var endcol = e.data.range.end.column;
	connection.send(JSON.stringify({type:"colab", action:action, row:row, col:col, endrow: endrow, endcol: endcol, text:e.data.text, content:editor.getValue()}));
}
/*

*/
var marks = ["blue","#1ABC9C","#16A085","#2ECC71","#27AE60","#3498DB","#2980B9","#9B59B6","#8E44AD","#F1C40F","#F39C12","#E67E22","#D35400","#E74C3C","#C0392B","#ECF0F1","#BDC3C7","#95A5A6","7F8C8D"];
function addColUser(name, picture, color, id){
	var img = "<img class=\"media-object\" src=\""+ picture +"\" alt=\"\" height=\"30px\">";
	var the_color = marks[Number(color.split("_")[1])];
	var h6 = "<p class=\"media-heading\">" + name + " " + "<i class=\"fa fa-circle\" style=\"color:"+ the_color +";float:right;margin-right:5px\"></i></p>"
	
	var a = "<a class=\"pull-left\">" + img + "</a>";
	var div = "<div class=\"media-body\">" + h6 + "</div>";
	var li = "<li class=\"media\" style=\"display:none\" id=\"id_" + id + "\">" + a + div + "</li>";
	
	var the_id = "#id_" + id;
	$("#online_ul").html($("#online_ul").html() + li);
	$(the_id).slideToggle("slow",function(){
		$(the_id).css("display","block");
	});
}
function removeColUser(id){
	var the_id = "#id_" + id;
	$(the_id).slideUp("slow",function(){
		$(the_id).remove();
	});
}